terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "eth-global-creator-rewards-terraform-state"
    key    = "terraform.tfstate"
    region = "eu-west-1"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC for the database
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.app_name}-vpc"
  cidr = var.vpc_cidr

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_vpn_gateway = false

  tags = var.tags
}

# Security group for the database
resource "aws_security_group" "database" {
  name_prefix = "${var.app_name}-db-"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

# Security group for Lambda functions
resource "aws_security_group" "lambda" {
  name_prefix = "${var.app_name}-lambda-"
  vpc_id      = module.vpc.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

# Subnet group for RDS
resource "aws_db_subnet_group" "database" {
  name       = "${var.app_name}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = var.tags

  depends_on = [
    module.vpc
  ]

  lifecycle {
    create_before_destroy = true
    ignore_changes = [
      name  # Prevent recreation due to name changes
    ]
  }
}

# PostgreSQL RDS instance
resource "aws_db_instance" "database" {
  identifier = "${var.app_name}-db"

  engine         = "postgres"
  engine_version = "16.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  storage_type          = "gp2"
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name   = aws_db_subnet_group.database.name
  parameter_group_name   = aws_db_parameter_group.database.name

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot = var.environment == "development"
  final_snapshot_identifier = var.environment == "development" ? null : "${var.app_name}-db-final-snapshot-${formatdate("YYYY-MM-DD-HH-MM", timestamp())}"
  deletion_protection = var.environment == "production"

  tags = var.tags

  depends_on = [
    aws_db_subnet_group.database,
    aws_security_group.database,
    aws_db_parameter_group.database
  ]

  lifecycle {
    prevent_destroy = false
    ignore_changes = [
      final_snapshot_identifier
    ]
  }
}

# Parameter group for PostgreSQL
resource "aws_db_parameter_group" "database" {
  family = "postgres16"
  name   = "${var.app_name}-db-params"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

# Null resource to ensure proper destruction order
resource "null_resource" "db_cleanup" {
  depends_on = [
    aws_db_instance.database
  ]

  provisioner "local-exec" {
    when    = destroy
    command = "echo 'Database cleanup - ensuring proper destruction order'"
  }
}

# OpenNext module for Next.js deployment
module "open_next" {
  source  = "RJPearson94/open-next/aws//modules/tf-aws-open-next-zone"
  version = "3.1.0"

  prefix = "creator-rewards"
  folder_path = var.open_next_folder_path

  # Server function configuration
  server_function = {
    handler = "index.handler"
    runtime = "nodejs20.x"
    environment_variables = {
      WLD_CLIENT_ID      = var.next_public_app_id
      NEXT_PUBLIC_APP_ID = var.next_public_app_id
      NODE_ENV           = "production"
      NEXTAUTH_SECRET    = var.nextauth_secret
      NEXTAUTH_URL       = var.domain_name != null ? "https://${var.domain_name}" : var.next_public_url != null ? var.next_public_url : "https://drrlmb6jtrdvb.cloudfront.net"
      DATABASE_URL       = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.database.endpoint}/${var.db_name}"
      NEYNAR_API_KEY     = var.neynar_api_key
      THE_GRAPH_API_KEY  = var.the_graph_api_key
      TALENT_API_KEY     = var.talent_api_key
      NEXT_PUBLIC_URL    = var.domain_name != null ? "https://${var.domain_name}" : var.next_public_url != null ? var.next_public_url : "https://drrlmb6jtrdvb.cloudfront.net"
      NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME = var.next_public_onchainkit_project_name
      REDIS_URL          = var.redis_url
      REDIS_TOKEN        = var.redis_token
    }
  }

  # Provider configurations
  providers = {
    aws.server_function = aws
    aws.iam            = aws
    aws.dns            = aws
    aws.global         = aws
  }
}

# Custom domain configuration (only if domain_name is provided)
resource "aws_acm_certificate" "custom_domain" {
  count = var.domain_name != null ? 1 : 0

  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = var.tags
}

# Certificate validation
resource "aws_acm_certificate_validation" "custom_domain" {
  count = var.domain_name != null ? 1 : 0

  certificate_arn         = aws_acm_certificate.custom_domain[0].arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# Route53 records for certificate validation
resource "aws_route53_record" "cert_validation" {
  for_each = var.domain_name != null ? {
    for dvo in aws_acm_certificate.custom_domain[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.custom_domain[0].zone_id
}

# Route53 hosted zone data source
data "aws_route53_zone" "custom_domain" {
  count = var.domain_name != null ? 1 : 0
  name  = var.hosted_zone
}

# Data source to get CloudFront hosted zone ID
data "aws_cloudfront_distribution" "main" {
  id = module.open_next.cloudfront_distribution_id
}

# Route53 A record for the custom domain
resource "aws_route53_record" "custom_domain" {
  count = var.domain_name != null ? 1 : 0

  zone_id = data.aws_route53_zone.custom_domain[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = replace(module.open_next.cloudfront_url, "https://", "")
    zone_id                = data.aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
} 
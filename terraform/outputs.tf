output "open_next_outputs" {
  description = "All OpenNext module outputs"
  value       = module.open_next
}

# Database outputs
output "database_endpoint" {
  description = "RDS database endpoint"
  value       = aws_db_instance.database.endpoint
}

output "database_name" {
  description = "RDS database name"
  value       = aws_db_instance.database.db_name
}

output "database_port" {
  description = "RDS database port"
  value       = aws_db_instance.database.port
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnets
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

# Custom domain outputs
output "custom_domain_name" {
  description = "Custom domain name"
  value       = var.domain_name
}

output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain name"
  value       = replace(module.open_next.cloudfront_url, "https://", "")
}

output "certificate_arn" {
  description = "ACM certificate ARN for custom domain"
  value       = var.domain_name != null ? aws_acm_certificate.custom_domain[0].arn : null
} 
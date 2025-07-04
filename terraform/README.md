# Terraform Infrastructure

This directory contains the Terraform configuration for deploying the Next.js application to AWS using OpenNext.

## Files

- `main.tf` - Main Terraform configuration
- `variables.tf` - Variable definitions
- `outputs.tf` - Output values
- `terraform.tfvars` - Configuration values
- `run.sh` - Helper script for Terraform commands

## Quick Start

### Using the helper script (recommended)

```bash
# Initialize Terraform
./run.sh init

# Plan the deployment
./run.sh plan

# Deploy to AWS
./run.sh apply

# View outputs
./run.sh output

# Destroy deployment
./run.sh destroy
```

### Using Terraform directly

```bash
# Initialize
terraform init

# Plan
terraform plan

# Apply
terraform apply

# Outputs
terraform output

# Destroy
terraform destroy
```

## Configuration

Edit `terraform.tfvars` to customize your deployment:

```hcl
# AWS Configuration
aws_region = "us-east-1"
app_name   = "your-app-name"

# Database Configuration
db_password = "your-secure-password"

# Environment
environment = "production"
```

## What Gets Deployed

- **VPC** with public and private subnets
- **PostgreSQL RDS Database** in private subnets
- **Security Groups** for database and Lambda access
- **OpenNext Infrastructure** (S3, CloudFront, Lambda, API Gateway)
- **Route53** (optional, for custom domains)

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. Terraform installed
3. Valid AWS credentials

## Security Notes

- Database is deployed in private subnets
- Security groups restrict access to database
- All data is encrypted at rest
- Database password should be changed in production

## Cost Optimization

- Use `db.t3.micro` for development
- Consider `db.t3.small` for production
- Destroy resources when not in use: `./run.sh destroy` 
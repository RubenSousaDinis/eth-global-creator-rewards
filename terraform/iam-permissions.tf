# Additional IAM permissions for RDS and ENI management
# This helps resolve the ENI detachment permission errors

# Data source to get current AWS account ID
data "aws_caller_identity" "current" {}

# Data source to get current AWS partition
data "aws_partition" "current" {}

# IAM policy document for enhanced RDS and ENI permissions
data "aws_iam_policy_document" "enhanced_rds_permissions" {
  statement {
    sid    = "EnhancedRDSPermissions"
    effect = "Allow"
    actions = [
      "rds:*",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribeNetworkInterfaceAttribute",
      "ec2:DetachNetworkInterface",
      "ec2:DeleteNetworkInterface",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSubnets",
      "ec2:DescribeVpcs",
      "ec2:DescribeAvailabilityZones",
      "ec2:DescribeAccountAttributes",
      "ec2:DescribeInternetGateways",
      "ec2:DescribeRouteTables",
      "ec2:DescribeNetworkAcls",
      "ec2:DescribeVpcAttribute",
      "ec2:ModifyNetworkInterfaceAttribute"
    ]
    resources = ["*"]
  }
}

# Output for documenting required permissions
output "required_iam_permissions" {
  description = "IAM permissions required for GitHub Actions to manage RDS and ENI resources"
  value = {
    policy_document = data.aws_iam_policy_document.enhanced_rds_permissions.json
    note = "These permissions should be attached to your GitHub Actions IAM user/role"
  }
}

# Local values for resource naming
locals {
  resource_prefix = "${var.app_name}-${var.environment}"
} 
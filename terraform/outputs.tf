# =================================================================
# Terraform Outputs (Resource References & Firewall Data)
# =================================================================

output "alb_dns_name" {
  description = "Public DNS name of the Application Load Balancer (configure CNAME for api.learnova.in)"
  value       = aws_lb.api.dns_name
}

output "nat_gateway_elastic_ip" {
  description = "Static Elastic IP of the NAT Gateway (MANDATORY: Whitelist this /32 in MongoDB Atlas Network Access)"
  value       = aws_eip.nat.public_ip
}

output "ecr_repository_url" {
  description = "Amazon ECR Docker Repository URL for GitHub Actions push"
  value       = aws_ecr_repository.backend.repository_url
}

output "s3_bucket_name" {
  description = "Private S3 storage bucket name for application documents"
  value       = aws_s3_bucket.storage.bucket
}

output "github_actions_role_arn" {
  description = "IAM Role ARN for GitHub Actions OIDC Authentication"
  value       = aws_iam_role.github_actions_oidc.arn
}

output "secrets_manager_secret_arn" {
  description = "AWS Secrets Manager secret ARN for production backend credentials"
  value       = aws_secretsmanager_secret.backend.arn
}

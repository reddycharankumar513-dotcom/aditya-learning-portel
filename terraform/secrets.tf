# =================================================================
# AWS Secrets Manager (Production Credentials Isolation)
# =================================================================

resource "aws_secretsmanager_secret" "backend" {
  name                    = "${var.project_name}/${var.environment}/backend"
  description             = "Production environment secrets for LEARNOVA API"
  recovery_window_in_days = 0 # Immediate deletion for clean tearing down

  tags = {
    Name = "${var.project_name}-${var.environment}-secrets"
  }
}

# Template secret string structure (never store plaintext values directly in IaC)
resource "aws_secretsmanager_secret_version" "backend" {
  secret_id = aws_secretsmanager_secret.backend.id
  secret_string = jsonencode({
    MONGODB_URI             = "mongodb+srv://learnova_app:REPLACE_WITH_REAL_PASSWORD@cluster0.mongodb.net/learnova_platform?retryWrites=true&w=majority"
    JWT_SECRET              = "REPLACE_WITH_CRYPTOGRAPHIC_JWT_SECRET_MIN_32_CHARS"
    RAZORPAY_KEY_ID         = "rzp_live_REPLACE_WITH_LIVE_KEY"
    RAZORPAY_KEY_SECRET     = "REPLACE_WITH_LIVE_SECRET"
    RAZORPAY_WEBHOOK_SECRET = "REPLACE_WITH_WEBHOOK_SECRET"
    ANTHROPIC_API_KEY       = "sk-ant-REPLACE_WITH_ANTHROPIC_KEY"
  })

  lifecycle {
    ignore_changes = [secret_string] # Ensure manual secret rotations in AWS Console are preserved
  }
}

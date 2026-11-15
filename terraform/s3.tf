# =================================================================
# AWS S3 Storage (Private Application Storage)
# =================================================================

resource "aws_s3_bucket" "storage" {
  bucket = "${var.project_name}-storage-${var.environment}-${var.aws_region}"

  tags = {
    Name = "${var.project_name}-storage-${var.environment}"
  }
}

# -------------------------------------------------------------
# Strict Public Access Block (Zero Direct Public Ingress)
# -------------------------------------------------------------
resource "aws_s3_bucket_public_access_block" "storage" {
  bucket = aws_s3_bucket.storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -------------------------------------------------------------
# Default Server-Side Encryption (SSE-S3 AES-256)
# -------------------------------------------------------------
resource "aws_s3_bucket_server_side_encryption_configuration" "storage" {
  bucket = aws_s3_bucket.storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# -------------------------------------------------------------
# CORS Rules for Presigned Browser Direct Uploads
# -------------------------------------------------------------
resource "aws_s3_bucket_cors_configuration" "storage" {
  bucket = aws_s3_bucket.storage.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD"]
    allowed_origins = [
      "https://${var.domain_name}",
      "https://www.${var.domain_name}",
      "https://app.${var.domain_name}",
      "https://*.vercel.app",
      "http://localhost:5173"
    ]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# -------------------------------------------------------------
# Lifecycle Rule: Expire temporary unconfirmed uploads after 7 days
# -------------------------------------------------------------
resource "aws_s3_bucket_lifecycle_configuration" "storage" {
  bucket = aws_s3_bucket.storage.id

  rule {
    id     = "expire-temp-uploads"
    status = "Enabled"

    filter {
      prefix = "uploads/temp/"
    }

    expiration {
      days = 7
    }
  }

  rule {
    id     = "transition-old-documents-to-ia"
    status = "Enabled"

    filter {
      prefix = "uploads/"
    }

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }
  }
}

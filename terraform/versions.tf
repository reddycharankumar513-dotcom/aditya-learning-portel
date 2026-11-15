terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # For production state management, configure an S3 remote backend:
  # backend "s3" {
  #   bucket         = "learnova-terraform-state-mumbai"
  #   key            = "production/terraform.tfstate"
  #   region         = "ap-south-1"
  #   dynamodb_table = "learnova-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "LEARNOVA"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "Learnova DevOps"
    }
  }
}

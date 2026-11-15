variable "aws_region" {
  description = "AWS deployment region (default: Mumbai ap-south-1)"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Target deployment environment (development, staging, production)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project identifier used in naming resources"
  type        = string
  default     = "learnova"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones in the target region for multi-AZ resiliency"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "container_port" {
  description = "Internal container port the Express backend listens on"
  type        = number
  default     = 5000
}

variable "container_cpu" {
  description = "Fargate CPU units (256 = 0.25 vCPU, 512 = 0.5 vCPU, 1024 = 1 vCPU)"
  type        = number
  default     = 512
}

variable "container_memory" {
  description = "Fargate Memory in MB (512, 1024, 2048)"
  type        = number
  default     = 1024
}

variable "desired_task_count" {
  description = "Desired number of running ECS backend tasks for high availability"
  type        = number
  default     = 2
}

variable "domain_name" {
  description = "Base domain name for the platform (supports free or custom domain)"
  type        = string
  default     = "learnova.in"
}

variable "acm_certificate_arn" {
  description = "ARN of the validated ACM SSL Certificate in ap-south-1 for HTTPS listener"
  type        = string
  default     = ""
}

variable "github_repository" {
  description = "GitHub repository for OIDC trust policy (e.g. reddycharankumar513-dotcom/aditya-learning-portel)"
  type        = string
  default     = "reddycharankumar513-dotcom/aditya-learning-portel"
}

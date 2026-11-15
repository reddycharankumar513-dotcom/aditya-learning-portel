# =================================================================
# Security Groups (Network Firewalls)
# =================================================================

# -------------------------------------------------------------
# ALB Security Group (Perimeter Facing)
# -------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Controls public inbound traffic to the Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  # Inbound HTTP (Port 80) for 301 Redirect to HTTPS
  ingress {
    description = "Public HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound HTTPS (Port 443) Secure
  ingress {
    description = "Public HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound to ECS Tasks on container port 5000 only
  egress {
    description = "Forward to ECS Backend"
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "tcp"
    cidr_blocks = [for s in aws_subnet.private : s.cidr_block]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-alb-sg"
  }
}

# -------------------------------------------------------------
# ECS Backend Security Group (Private Subnets)
# -------------------------------------------------------------
resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-${var.environment}-ecs-sg"
  description = "Isolates ECS Fargate tasks - accepts traffic ONLY from ALB SG"
  vpc_id      = aws_vpc.main.id

  # Inbound Port 5000 strictly from ALB Security Group
  ingress {
    description     = "Inbound from ALB SG only"
    from_port       = var.container_port
    to_port         = var.container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Outbound internet traffic via NAT Gateway (for MongoDB Atlas, AI APIs, Razorpay, S3)
  egress {
    description = "Allow outbound to NAT Gateway"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-ecs-sg"
  }
}

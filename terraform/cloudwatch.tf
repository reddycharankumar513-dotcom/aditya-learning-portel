# =================================================================
# AWS CloudWatch Monitoring & Metric Alarms
# =================================================================

# -------------------------------------------------------------
# CloudWatch Log Group (30 Days Retention)
# -------------------------------------------------------------
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}-${var.environment}-backend"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-${var.environment}-log-group"
  }
}

# -------------------------------------------------------------
# Metric Alarm: High CPU Utilization (> 80% for 2 periods)
# -------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "${var.project_name}-${var.environment}-high-cpu"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Triggered when ECS backend CPU utilization exceeds 80%"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.backend.name
  }
}

# -------------------------------------------------------------
# Metric Alarm: High Memory Utilization (> 80% for 2 periods)
# -------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "memory_high" {
  alarm_name          = "${var.project_name}-${var.environment}-high-memory"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Triggered when ECS backend Memory utilization exceeds 80%"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.backend.name
  }
}

# -------------------------------------------------------------
# Metric Alarm: ALB 5XX Internal Server Error Spike (> 10 errors in 5 min)
# -------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.project_name}-${var.environment}-alb-5xx-spike"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 1
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Triggered when ALB records more than 10 5XX responses in 5 minutes"

  dimensions = {
    LoadBalancer = aws_lb.api.arn_suffix
  }
}

# -------------------------------------------------------------
# Metric Alarm: Target Response Latency (> 2000ms for 2 periods)
# -------------------------------------------------------------
resource "aws_cloudwatch_metric_alarm" "target_latency" {
  alarm_name          = "${var.project_name}-${var.environment}-high-latency"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 2.0 # 2 seconds
  alarm_description   = "Triggered when average target response time exceeds 2.0s"

  dimensions = {
    LoadBalancer = aws_lb.api.arn_suffix
  }
}

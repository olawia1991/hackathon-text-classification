resource "aws_cloudwatch_log_group" "hackathon_text_classification_log_group" {
  name              = "/ecs/hack-text-classifi-app"
  retention_in_days = 30

  tags = {
    Name = "${terraform.workspace}-hack-text-classifi-log-group"
  }
}

resource "aws_cloudwatch_log_stream" "hackathon_text_classification_log_stream" {
  name           = "${terraform.workspace}-hack-text-classifi-log-stream"
  log_group_name = aws_cloudwatch_log_group.hackathon_text_classification_log_group.name
}
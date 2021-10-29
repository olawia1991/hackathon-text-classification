resource "aws_ecs_cluster" "main" {
  name = "hack-text-classifi-cluster"
}

data "template_file" "hackathon_text_classification_app" {
  template = file("./templates/ecs/hackathon-text-classification_app.json.tpl")

  vars = {
    app_image      = "593056042160.dkr.ecr.eu-west-2.amazonaws.com/hackathon-text-classification-${terraform.workspace}-repository:latest"
    app_port       = var.app_port
    fargate_cpu    = var.fargate_cpu
    fargate_memory = var.fargate_memory
    aws_region     = var.aws_region
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${terraform.workspace}-hack-text-classifi-app-task"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.hackathon_text_classification_app.rendered
}

resource "aws_ecs_service" "main" {
  name            = "${terraform.workspace}-hack-text-classifi-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = "hackathon-text-classification-app"
    container_port   = var.app_port
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
}
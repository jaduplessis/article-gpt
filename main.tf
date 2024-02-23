// main.tf
# ----------------- Pushing Docker Images to repository -----------------
locals {
 container_name = "article-gpt-container"
 container_port = 80 # ! Must be same EXPORE port from our Dockerfile
 example = "article-gpt-ecs"
 image_name = format("%v:%v", module.ecr.repository_url, "latest")
}

# * Give Docker permission to pusher Docker images to AWS
data "aws_caller_identity" "this" {}
data "aws_ecr_authorization_token" "this" {}
data "aws_region" "this" {}
locals { ecr_address = format("%v.dkr.ecr.%v.amazonaws.com", data.aws_caller_identity.this.account_id, data.aws_region.this.name) }
provider "docker" {
 registry_auth {
  address  = local.ecr_address
  password = data.aws_ecr_authorization_token.this.password
  username = data.aws_ecr_authorization_token.this.user_name
 }
}

module "ecr" {
 source  = "terraform-aws-modules/ecr/aws"
 version = "~> 1.6.0"

 repository_force_delete = true
 repository_name = local.example
 repository_lifecycle_policy = jsonencode({
  rules = [{
   action = { type = "expire" }
   description = "Delete all images except a handful of the newest images"
   rulePriority = 1
   selection = {
    countNumber = 3
    countType = "imageCountMoreThan"
    tagStatus = "any"
   }
  }]
 })
}

# * Build our Image locally with the appropriate name so that we can push 
resource "docker_image" "this" {
 name = local.image_name
 
 build { 
    context = "article-gpt/"
  } 
}

# * Push our container image to our ECR.
resource "docker_registry_image" "this" {
 keep_remotely = true # Do not delete old images when a new image is pushed
 name = docker_image.this.name
}


# ----------------- Set up Security Group -----------------
# * Use the default VPC
data "aws_vpc" "default" {
  default = true
}

data "aws_subnet_ids" "default" {
  vpc_id = data.aws_vpc.default.id
}

# * Create a Security Group for the Fargate Service
resource "aws_security_group" "fargate_sg" {
  name        = "fargate-service-sg"
  description = "Allow web traffic to Fargate service"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = local.container_port
    to_port     = local.container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ----------------- Create IAM Roles and Policies -----------------
# * IAM Role for ECS Tasks
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "article-gpt-ecs-task-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      },
    ]
  })
}

# * ECS Task Execution Role Policy
resource "aws_iam_policy" "ecs_task_execution_policy" {
  name        = "article-gpt-ecs-task-execution-policy"
  path        = "/"
  description = "ECS Task Execution Role Policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
        Effect   = "Allow"
      },
    ]
  })
}

# * Attach the policy to the role
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_execution_policy.arn
}


# ----------------- Create ECS Cluster and Task Definition -----------------
# * ECS Task Definition
resource "aws_ecs_task_definition" "article_gpt_task" {
  family                   = "article-gpt-ecs-task"
  cpu                      = "256"
  memory                   = "512"
  network_mode             = "awsvpc"

  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = jsonencode([
    {
      name      = local.container_name
      image     = local.image_name
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = local.container_port
          hostPort      = local.container_port
          protocol      = "tcp"
        }
      ]
    }
  ])
  
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture = "ARM64"
  }
}

# * ECS Cluster
resource "aws_ecs_cluster" "ecs_cluster" {
  name = "article-gpt-ecs-cluster"
}

# * Fargate Service
resource "aws_ecs_service" "fargate_service" {
  name            = "article-gpt-fargate-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.article_gpt_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets = data.aws_subnet_ids.default.ids
    security_groups = [aws_security_group.fargate_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.alb_target_group.arn
    container_name   = local.container_name
    container_port   = local.container_port
  }
}

# ----------------- Application Load Balancer -----------------
# * Security Group for the Load Balancer
resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow web traffic to ALB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = local.container_port
    to_port     = local.container_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# * Application Load Balancer
resource "aws_lb" "alb" {
  name               = "article-gpt-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnet_ids.default.ids

  security_groups    = [aws_security_group.alb_sg.id]
}

# * Target Group
resource "aws_lb_target_group" "alb_target_group" {
  name     = "article-gpt-target-group"
  port     = local.container_port
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    path                = "/health"
  }
}

# * Listener
resource "aws_lb_listener" "alb_listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_target_group.arn
  }
}

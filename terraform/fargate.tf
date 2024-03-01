// main.tf

# ----------------- Set up Security Group -----------------


# * Create a Security Group for the Fargate Service
resource "aws_security_group" "fargate_sg" {
  name        = "fargate-service-sg"
  description = "Allow web traffic to Fargate service"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = local.container_port
    to_port     = local.container_port
    protocol    = "tcp"
    security_groups = [aws_security_group.alb_sg.id] # Only allow traffic from the ALB
    
    # cidr_blocks = ["0.0.0.0/0"] # Allow traffic from anywhere
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


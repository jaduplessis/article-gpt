# ----------------- Application Load Balancer -----------------
# * Security Group for the Load Balancer
resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow web traffic to ALB"
  # vpc_id      = data.aws_vpc.default.id
  vpc_id      = aws_vpc.article_gpt_vpc.id

  ingress {
    from_port   = local.container_port
    to_port     = local.container_port
    protocol    = "tcp"
    # cidr_blocks = [data.aws_vpc.default.cidr_block]
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
  # subnets            = data.aws_subnet_ids.default.ids
  subnets            = [ 
    aws_subnet.article_gpt_subnet_1.id, 
    aws_subnet.article_gpt_subnet_2.id, 
    aws_subnet.article_gpt_subnet_3.id 
  ]

  security_groups    = [aws_security_group.alb_sg.id]
}

# * Target Group
resource "aws_lb_target_group" "alb_target_group" {
  name     = "article-gpt-target-group"
  port     = local.container_port
  protocol = "HTTP"
  vpc_id   = aws_vpc.article_gpt_vpc.id
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

# ----------------- Outputs -----------------
# * Public IP of the Load Balancer
output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

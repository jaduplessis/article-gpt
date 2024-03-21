
# * API Gateway
resource "aws_apigatewayv2_api" "article_gpt_http_api" {
  name            = "ArticleGPTAPI"
  description     = "API Gateway to expose Fargate Service"
  protocol_type   = "HTTP"
}

# * integration with ALB
resource "aws_apigatewayv2_integration" "alb_integration" {
  api_id = aws_apigatewayv2_api.article_gpt_http_api.id
  integration_type    = "HTTP_PROXY"

  connection_type     = "VPC_LINK"
  connection_id       = aws_apigatewayv2_vpc_link.vpc_link.id
  description         = "Integration with ALB"
  integration_method  = "ANY"
  integration_uri     = aws_lb_listener.alb_listener.arn
}

resource "aws_apigatewayv2_vpc_link" "vpc_link" {
  name               = "article-gpt-vpc-link"
  security_group_ids = [aws_security_group.alb_sg.id]
  # subnet_ids = data.aws_subnet_ids.default.ids
  subnet_ids         = [ 
    aws_subnet.article_gpt_subnet_1.id, 
    aws_subnet.article_gpt_subnet_2.id, 
    aws_subnet.article_gpt_subnet_3.id 
  ]
}

# * Stage
resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.article_gpt_http_api.id
  name        = "dev"
  auto_deploy = true
}


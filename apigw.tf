
# * API Gateway
resource "aws_api_gateway_rest_api" "api" {
  name        = "FargateServiceAPI"
  description = "API Gateway to expose Fargate Service"
}

# * Health Check Route
resource "aws_api_gateway_resource" "health_resource" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "health"
}

# * Health Check Method
resource "aws_api_gateway_method" "health_method" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.health_resource.id
  http_method   = "GET"
  authorization = "NONE"
  api_key_required = true # If you want to use API Keys
}

# * Health Check Integration
resource "aws_api_gateway_integration" "health_integration" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_resource.health_resource.id
  http_method = aws_api_gateway_method.health_method.http_method

  type                    = "HTTP_PROXY"
  integration_http_method = "GET"
  uri                     = "http://${aws_lb.alb.dns_name}/health"
  connection_type         = "INTERNET"
}

# * API Deployment
resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.health_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = "v1"
}

# * API Key
resource "aws_api_gateway_api_key" "api_key" {
  name        = "article-gpt-api-key"
  description = "API Key for article-gpt"
  enabled     = true
}

# * Usage Plan
resource "aws_api_gateway_usage_plan" "usage_plan" {
  name        = "article-gpt-usage-plan"
  description = "Usage Plan for article-gpt"
  product_code = "article-gpt"
  
  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_deployment.api_deployment.stage_name
  }
}

# * API Key Association
resource "aws_api_gateway_usage_plan_key" "api_key_association" {
  key_id        = aws_api_gateway_api_key.api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.usage_plan.id
}












# # * Route Resource
# resource "aws_api_gateway_resource" "health" {
#   rest_api_id = aws_api_gateway_rest_api.article_gpt_api.id
#   parent_id   = aws_api_gateway_rest_api.article_gpt_api.root_resource_id
#   path_part   = "health"
# }

# resource "aws_api_gateway_resource" "get_edits_resource" {
#   rest_api_id = aws_api_gateway_rest_api.my_api.id
#   parent_id   = aws_api_gateway_rest_api.my_api.root_resource_id
#   path_part   = "get_edits"
# }

# resource "aws_api_gateway_resource" "file_name_resource" {
#   rest_api_id = aws_api_gateway_rest_api.my_api.id
#   parent_id   = aws_api_gateway_resource.get_edits_resource.id
#   path_part   = "{file_name}"
# }

# resource "aws_api_gateway_method" "get_edits_method" {
#   rest_api_id   = aws_api_gateway_rest_api.my_api.id
#   resource_id   = aws_api_gateway_resource.file_name_resource.id
#   http_method   = "GET"
#   authorization = "NONE"
# }

# resource "aws_api_gateway_integration" "get_edits_integration" {
#   rest_api_id             = aws_api_gateway_rest_api.my_api.id
#   resource_id             = aws_api_gateway_resource.file_name_resource.id
#   http_method             = aws_api_gateway_method.get_edits_method.http_method
#   type                    = "HTTP_PROXY"
#   integration_http_method = "GET" # Match the HTTP method used by FastAPI
#   uri                     = "http://${aws_lb.my_nlb.dns_name}/get_edits/{file_name}"
#   connection_type         = "VPC_LINK"
#   connection_id           = aws_api_gateway_vpc_link.my_vpc_link.id
#   request_parameters = {
#     "integration.request.path.file_name" = "method.request.path.file_name"
#   }
# }

# resource "aws_api_gateway_method_response" "200" {
#   rest_api_id = aws_api_gateway_rest_api.my_api.id
#   resource_id = aws_api_gateway_resource.file_name_resource.id
#   http_method = aws_api_gateway_method.get_edits_method.http_method
#   status_code = "200"
# }

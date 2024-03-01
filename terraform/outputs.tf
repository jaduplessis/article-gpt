
output "api_gatewayv2_endpoint" {
  description = "The endpoint URL of the API Gateway"
  value       = aws_apigatewayv2_api.article_gpt_http_api.api_endpoint
}



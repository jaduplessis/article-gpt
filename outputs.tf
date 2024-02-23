
output "api_key_value" {
  description = "The value of the API key for accessing the API"
  value       = aws_api_gateway_api_key.api_key.value
  sensitive   = true
}

output "api_gateway_endpoint" {
  description = "The endpoint URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${var.aws_region}.amazonaws.com/${aws_api_gateway_deployment.api_deployment.stage_name}/"
}



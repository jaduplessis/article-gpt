
# * /health Check Route
resource "aws_apigatewayv2_route" "health_route" {
  api_id = aws_apigatewayv2_api.article_gpt_http_api.id
  route_key = "GET /health"
  target = "integrations/${aws_apigatewayv2_integration.alb_integration.id}"
}


# * /get_file Route
resource "aws_apigatewayv2_route" "get_file_route" {
  api_id = aws_apigatewayv2_api.article_gpt_http_api.id
  route_key = "GET /get_file"
  target = "integrations/${aws_apigatewayv2_integration.alb_integration.id}"
}




locals {
 container_name = "article-gpt-container"
 container_port = 80 # ! Must be same EXPORE port from our Dockerfile
 example = "article-gpt-ecs"
# Include time stamp in the image name to avoid caching issues
 image_name = format("%v:%v", module.ecr.repository_url, formatdate("YYYY-MM-DD'T'hh-mm-ss", timestamp()))
}

# * Use the default VPC
data "aws_vpc" "default" {
  default = true
}

data "aws_subnet_ids" "default" {
  vpc_id = data.aws_vpc.default.id
}
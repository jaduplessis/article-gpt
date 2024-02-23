
terraform {
 required_version = "~> 1.3"

 required_providers {
  aws = {
   source  = "hashicorp/aws"
   version = "~> 4.56"
  }
  docker = {
   source  = "kreuzwerker/docker"
   version = "~> 3.0"
  }
 }
}

# * Save the AWS region in a variable
variable "aws_region" {
 description = "The AWS region to deploy to"
 default     = "eu-west-2"
}

provider "aws" {
 region = var.aws_region
}
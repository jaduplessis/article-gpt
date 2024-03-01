# ----------------- Pushing Docker Images to repository -----------------
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
    context = "../../article-gpt/"
  } 
}

# * Push our container image to our ECR.
resource "docker_registry_image" "this" {
 keep_remotely = true # Do not delete old images when a new image is pushed
 name = docker_image.this.name
}
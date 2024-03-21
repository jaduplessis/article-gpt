
# * Create VPC
resource "aws_vpc" "article_gpt_vpc" {
  cidr_block = "10.0.0.0/16"
}

# * Internet Gateway
resource "aws_internet_gateway" "article_gpt_igw" {
  vpc_id = aws_vpc.article_gpt_vpc.id
}

# # * Subnet
resource "aws_subnet" "article_gpt_subnet_1" {
  vpc_id     = aws_vpc.article_gpt_vpc.id
  cidr_block = "10.0.0.0/24"
  availability_zone = "eu-west-2a"
}

resource "aws_subnet" "article_gpt_subnet_2" {
  vpc_id     = aws_vpc.article_gpt_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "eu-west-2b"
}

resource "aws_subnet" "article_gpt_subnet_3" {
  vpc_id     = aws_vpc.article_gpt_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "eu-west-2c"
}


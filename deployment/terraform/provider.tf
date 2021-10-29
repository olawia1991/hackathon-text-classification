provider "aws" {
  shared_credentials_file = "$HOME/.aws/credentials"
  profile = "default"
  region = var.aws_region
}

terraform {
  backend "s3" {
    region = "eu-west-2"
    bucket = "hackathon-text-classification-deployment"
    key="terraform/terraform.tfstate"
  }
}
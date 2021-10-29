resource "aws_dynamodb_table" "dynamodb-table" {
  name           = "${terraform.workspace}-HackathonTextClassification"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "user"
  range_key      = "tags"

  attribute {
    name = "user"
    type = "S"
  }

  attribute {
    name = "tags"
    type = "S"
  }

  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }
}
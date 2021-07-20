resource "aws_dynamodb_table" "organisations" {
  name           = "organisations"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "OrganisationId"
  range_key      = "UserId"

  attribute {
    name = "OrganisationId"
    type = "S"
  }

  attribute {
    name = "UserId"
    type = "S"
  }

  // Name, IsOwner, IsInvitation, InvittationExpiryDate

  global_secondary_index {
    name            = "UserOrganisations"
    hash_key        = "UserId"
    range_key       = "OrganisationId"
    write_capacity  = 5
    read_capacity   = 5
    projection_type = "KEYS_ONLY"
  }
}
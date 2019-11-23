import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    roles(input: RolesInput!): RolesResponse!
  }

  extend type Mutation {
    createRole(input: CreateRoleInput): MutationResponse!
    updateRole(input: UpdateRoleInput): MutationResponse!
  }

  input CreateRoleInput {
    name: String!
    description: String!
    institution_id: String
  }

  input UpdateRoleInput {
    id: ID!
    name: String!
    description: String!
    institution_id: String
  }

  input RolesInput {
    pageNumber: Int!
    pageSize: Int
    institution_id: String
  }

  type Role {
    id: ID!
    name: String!
    description: String
    institution_id: String
    institution: Institution
  }

  type RolesResponse {
    count: Int!
    rows: [Role!]
  }
`;

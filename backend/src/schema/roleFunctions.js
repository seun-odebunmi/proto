import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    roleFunctions(input: RoleFunctionsInput!): [RoleFunction!]
  }

  extend type Mutation {
    createRoleFunction(input: CreateRoleFunctionInput!): MutationResponse!
  }

  input RoleFunctionsInput {
    role_id: ID!
  }

  input CreateRoleFunctionInput {
    role_id: ID!
    menu_ids: [ID!]!
  }

  type RoleFunction {
    role_id: ID!
    menu_id: ID!
    menu: Menu
  }
`;

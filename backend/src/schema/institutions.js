import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    institutions(input: InstitutionsInput!): InstitutionsReturn!
  }

  extend type Mutation {
    createInstitution(input: CreateInstitutionInput!): MutationResponse!
    updateInstitution(input: UpdateInstitutionInput!): MutationResponse!
  }

  input InstitutionsInput {
    pageNumber: Int!
    pageSize: Int
    country_id: String
  }

  input CreateInstitutionInput {
    name: String!
    code: String!
    accentColor: String!
    logo: String!
    country_id: String!
  }

  input UpdateInstitutionInput {
    id: ID!
    name: String!
    code: String!
    accentColor: String!
    logo: String!
    country_id: String!
  }

  type InstitutionsReturn {
    count: Int!
    rows: [Institution!]
  }

  type Institution {
    id: ID!
    name: String!
    code: String!
    accentColor: String
    logo: String
    isISW: Boolean!
    country_id: String
    country: Country
  }
`;

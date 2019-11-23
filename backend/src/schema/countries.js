import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    countries(input: CountriesInput!): CountriesReturn!
  }

  extend type Mutation {
    createCountry(input: CreateCountryInput!): MutationResponse!
    updateCountry(input: UpdateCountryInput!): MutationResponse!
  }

  input CountriesInput {
    pageNumber: Int!
    pageSize: Int
    name: String
    active: Boolean
  }

  input CreateCountryInput {
    name: String!
    code: String!
  }

  input UpdateCountryInput {
    id: ID!
    name: String!
    code: String!
  }

  type CountriesReturn {
    count: Int!
    rows: [Country!]
  }

  type Country {
    id: ID!
    name: String
    code: String
    active: Boolean!
  }
`;

import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    branches(input: BranchesInput!): BranchesResponse!
  }

  extend type Mutation {
    createBranch(input: CreateBranchInput!): MutationResponse!
    updateBranch(input: UpdateBranchInput!): MutationResponse!
    activateBranch(input: ActivateBranchInput!): MutationResponse!
    deactivateBranch(input: DeactivateBranchInput!): MutationResponse!
  }

  input BranchesInput {
    pageNumber: Int!
    pageSize: Int
    activeStatus: Boolean
    institution_id: String
  }

  input CreateBranchInput {
    name: String!
    code: String!
    institution_id: String
  }

  input UpdateBranchInput {
    id: ID!
    name: String!
    code: String!
    institution_id: String
  }

  input ActivateBranchInput {
    id: ID!
  }

  input DeactivateBranchInput {
    id: ID!
  }

  type Branch {
    id: ID
    name: String
    activeStatus: Boolean
    code: String
    institution_id: String
    institution: Institution
  }

  type BranchesResponse {
    count: Int!
    rows: [Branch!]
  }
`;

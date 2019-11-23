import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    pendingRequests(input: PendingRequestsInput!): PendingRequestsResponse
    requestTypes: [RequestTypes!]
  }

  extend type Mutation {
    declinePendingRequest(input: DeclineRequestInput!): MutationResponse!
    approvePendingRequest(input: ApproveRequestInput!): MutationResponse!
  }

  input DeclineRequestInput {
    requestId: ID!
  }

  input ApproveRequestInput {
    requestId: ID!
  }

  input PendingRequestsInput {
    pageNumber: Int!
    pageSize: Int
    startDate: String
    endDate: String
    requestType: String
  }

  type PendingRequestsResponse {
    count: Int!
    rows: [PendingRequest!]
  }

  type PendingRequest {
    id: ID!
    actionOn: String!
    description: String
    additionalInfo: String
    requestDate: String
    requestType: String
    requestorEmail: String
    requestor: String
    status: String
    portalAction: Boolean
  }

  type RequestTypes {
    key: String
    value: String
  }
`;

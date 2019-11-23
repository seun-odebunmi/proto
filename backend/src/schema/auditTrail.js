import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    auditTrail(input: AuditTrailInput!): AuditTrailResponse!
  }

  input AuditTrailInput {
    pageNumber: Int!
    pageSize: Int
    startDate: String
    endDate: String
    sourceAccount: String
    actionOn: String
    actionBy: String
    auditType: String
  }

  type Audit {
    id: ID!
    createDate: String!
    auditType: String!
    actionOn: String!
    actionBy: String!
    status: String!
    details: String!
    sourceAccount: String
    userIp: String
  }

  type AuditTrailResponse {
    count: Int!
    rows: [Audit!]
  }
`;

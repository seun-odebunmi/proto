import { gql } from 'apollo-server-express';

import usersSchema from './users';
import roleFunctionsSchema from './roleFunctions';
import menusSchema from './menus';
import branchesSchema from './branches';
import rolesSchema from './roles';
import countrySchema from './countries';
import institutionSchema from './institutions';
import pendingRequestsSchema from './pendingRequests';
import auditTrailsSchema from './auditTrail';

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type MutationResponse {
    success: Boolean!
    description: String!
  }

  type Mutation {
    _: Boolean
  }
`;

export default [
  linkSchema,
  usersSchema,
  rolesSchema,
  countrySchema,
  institutionSchema,
  branchesSchema,
  roleFunctionsSchema,
  menusSchema,
  pendingRequestsSchema,
  auditTrailsSchema
];

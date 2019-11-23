import usersResolvers from './users';
import roleFunctionsResolvers from './roleFunctions';
import menusResolvers from './menus';
import rolesResolvers from './roles';
import countriesResolvers from './countries';
import institutionsResolvers from './institutions';
import branchesResolvers from './branches';
import pendingRequestsResolvers from './pendingRequests';
import auditTrailsResolvers from './auditTrail';

export default [
  usersResolvers,
  rolesResolvers,
  countriesResolvers,
  institutionsResolvers,
  branchesResolvers,
  roleFunctionsResolvers,
  menusResolvers,
  pendingRequestsResolvers,
  auditTrailsResolvers
];

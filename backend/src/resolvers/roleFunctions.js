import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    roleFunctions: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models }) => {
        return await models.RoleFunctions.fetchRoleFunctions(input);
      }
    )
  },

  Mutation: {
    createRoleFunction: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models }) => {
        return await models.RoleFunctions.createRoleFunction(input);
      }
    )
  }
};

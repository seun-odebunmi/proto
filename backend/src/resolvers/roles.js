import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    roles: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token: { user } }) => {
        const institution_id = user.institution.isISW
          ? input.institution_id
          : user.institution_id;
        const moddedInput = { ...input, institution_id };

        return await models.Roles.fetchRoles(moddedInput);
      }
    )
  },

  Mutation: {
    createRole: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        const moddedInput = {
          ...input,
          institution_id: input.institution_id || token.user.institution_id
        };

        return await models.Roles.createRoleInit(moddedInput, token);
      }
    ),
    updateRole: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        const moddedInput = {
          ...input,
          institution_id: input.institution_id || token.user.institution_id
        };

        return await models.Roles.updateRoleInit(moddedInput, token);
      }
    )
  }
};

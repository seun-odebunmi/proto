import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    branches: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token: { user } }) => {
        const institution_id = user.institution.isISW
          ? input.institution_id
          : user.institution_id;
        const moddedInput = { ...input, institution_id };

        return await models.Branches.fetchBranches(moddedInput);
      }
    )
  },

  Mutation: {
    createBranch: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        const moddedInput = {
          ...input,
          institution_id: input.institution_id || token.user.institution_id
        };

        return await models.Branches.createBranchInit(moddedInput, token);
      }
    ),
    updateBranch: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        const moddedInput = {
          ...input,
          institution_id: input.institution_id || token.user.institution_id
        };

        return await models.Branches.updateBranchInit(moddedInput, token);
      }
    ),
    activateBranch: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.Branches.activateBranchInit(input, token);
      }
    ),
    deactivateBranch: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.Branches.deactivateBranchInit(input, token);
      }
    )
  }
};

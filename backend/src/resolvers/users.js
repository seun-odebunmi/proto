import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    users: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token: { user } }) => {
        const institution_id = user.institution.isISW
          ? input.institution_id
          : user.institution_id;
        const moddedInput = { ...input, institution_id };

        return await models.Users.fetchUsers(moddedInput);
      }
    ),
    user: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models }) => {
        return await models.Users.fetchUserById(input.id);
      }
    )
  },

  Mutation: {
    login: async (_, { input }, { models, token }) => {
      return await models.Users.login(input, token);
    },
    createUser: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        const moddedInput = {
          ...input,
          institution_id: input.institution_id || token.user.institution_id
        };

        return await models.Users.createUserInit(moddedInput, token);
      }
    ),
    updateUser: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        const moddedInput = {
          ...input,
          institution_id: input.institution_id || token.user.institution_id
        };

        return await models.Users.updateUserInit(moddedInput, token);
      }
    ),
    activateUser: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.Users.activateUserInit(input, token);
      }
    ),
    deactivateUser: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.Users.deactivateUserInit(input, token);
      }
    ),
    changePassword: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.Users.changePassword(input, token);
      }
    ),
    resetPassword: async (_, { input }, { models, token }) => {
      return await models.Users.resetPassword(input, token);
    }
  }
};

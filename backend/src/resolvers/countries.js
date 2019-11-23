import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isISW } from './authorization';

export default {
  Query: {
    countries: combineResolvers(
      isAuthenticated,
      isISW,
      async (_, { input }, { models }) => {
        return await models.Countries.fetchCountries(input);
      }
    )
  },

  Mutation: {
    createCountry: combineResolvers(
      isAuthenticated,
      isISW,
      async (_, { input }, { models, token }) => {
        return await models.Countries.createCountryInit(input, token);
      }
    ),
    updateCountry: combineResolvers(
      isAuthenticated,
      isISW,
      async (_, { input }, { models, token }) => {
        return await models.Countries.updateCountryInit(input, token);
      }
    )
  }
};

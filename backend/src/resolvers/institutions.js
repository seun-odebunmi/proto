import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isISW } from './authorization';
import fs from 'fs';

export default {
  Query: {
    institutions: combineResolvers(
      isAuthenticated,
      isISW,
      async (_, { input }, { models }) => {
        return await models.Institutions.fetchInstitutions(input);
      }
    )
  },
  Institution: {
    logo: ({ dataValues }) => {
      const file = `data:image/png;base64,${fs.readFileSync(
        dataValues.logo,
        'base64'
      )}`;

      return file;
    }
  },

  Mutation: {
    createInstitution: combineResolvers(
      isAuthenticated,
      isISW,
      async (_, { input }, { models, token }) => {
        return await models.Institutions.createInstitutionInit(input, token);
      }
    ),
    updateInstitution: combineResolvers(
      isAuthenticated,
      isISW,
      async (_, { input }, { models, token }) => {
        return await models.Institutions.updateInstitutionInit(input, token);
      }
    )
  }
};

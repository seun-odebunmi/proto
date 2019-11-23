import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    menus: combineResolvers(
      isAuthenticated,
      async (_, { input: { institution_id } }, { models, token }) => {
        const { dataValues } = institution_id
          ? await models.Institutions.fetchInstitutionById(institution_id)
          : {};
        const { isISW } = dataValues || token.user.institution;

        return await models.Menus.fetchMenus(isISW);
      }
    )
  }
};

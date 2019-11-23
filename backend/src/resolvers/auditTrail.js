import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';
import { UTILS } from '../constants';

export default {
  Query: {
    auditTrail: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token: { user } }) => {
        const institution_id = user.institution.isISW
          ? input.institution_id
          : user.institution_id;
        const moddedInput = { ...input, institution_id };

        return await models.AuditTrail.fetchAuditTrail(moddedInput);
      }
    )
  },
  Audit: {
    createDate: ({ dataValues }) => {
      return UTILS.formatDate(dataValues.createDate);
    },
    auditType: ({ dataValues }) => {
      return UTILS.requests[dataValues.auditType].key;
    },
    status: ({ dataValues }) => {
      return UTILS.requestStatus[dataValues.status];
    }
  }
};

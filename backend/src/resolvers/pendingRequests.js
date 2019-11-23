import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated } from './authorization';
import { UTILS } from '../constants';

export default {
  Query: {
    pendingRequests: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.PendingRequests.fetchPendingRequests(input, token);
      }
    ),
    requestTypes: combineResolvers(
      isAuthenticated,
      async (_, __, { models }) => {
        return await models.PendingRequests.fetchRequestTypes();
      }
    )
  },
  PendingRequest: {
    requestDate: ({ dataValues }) => {
      return UTILS.formatDate(dataValues.requestDate);
    },
    requestType: ({ dataValues }) => {
      return UTILS.requests[dataValues.requestType].key;
    },
    status: ({ dataValues }) => {
      return UTILS.requestStatus[dataValues.status];
    }
  },

  Mutation: {
    declinePendingRequest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.PendingRequests.declinePendingRequest(input, token);
      }
    ),
    approvePendingRequest: combineResolvers(
      isAuthenticated,
      async (_, { input }, { models, token }) => {
        return await models.PendingRequests.approvePendingRequest(input, token);
      }
    )
  }
};

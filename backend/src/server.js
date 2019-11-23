import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schema';
import resolvers from './resolvers';
import { models } from './models';

import { error } from './helpers';

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = await models.Session.verifyToken(req);
    const userIp = req.ip || null;
    // console.log('IP', userIp);

    return { models, token: { ...token, userIp } };
  },
  formatError: error,
  introspection: true,
  playground: true
});

const app = express();
app.use(cors(), helmet());
apollo.applyMiddleware({ app });

export default app;

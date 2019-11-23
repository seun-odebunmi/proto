import { ForbiddenError } from 'apollo-server';
import { skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { token }) =>
  token
    ? skip
    : new ForbiddenError('You are not authorized to access this service!');

export const isISW = (parent, args, { token }) => {
  const { isISW } = token.user.institution;
  return isISW
    ? skip
    : new ForbiddenError('You are not authorized to access this service!');
};

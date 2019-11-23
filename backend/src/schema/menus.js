import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    menus(input: MenuInput): [Menu!]
  }

  input MenuInput {
    institution_id: ID
  }

  type Menu {
    id: ID!
    hasSubMenu: Boolean!
    href: String
    icon: String
    routerLink: String
    target: String
    title: String!
    parent_id: ID
  }
`;

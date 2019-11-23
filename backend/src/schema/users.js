import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users(input: UsersInput!): UsersResponse!
    user(input: UserInput!): User!
  }

  extend type Mutation {
    login(input: LoginInput!): UserAuth
    createUser(input: CreateUserInput!): MutationResponse!
    updateUser(input: UpdateUserInput!): MutationResponse!
    activateUser(input: ActivateUserInput!): MutationResponse!
    deactivateUser(input: DeactivateUserInput!): MutationResponse!
    deleteUser(input: DeleteUserInput!): MutationResponse!
    changePassword(input: ChangePasswordInput!): MutationResponse!
    resetPassword(input: ResetPasswordInput!): MutationResponse!
  }

  input UsersInput {
    pageNumber: Int!
    pageSize: Int
    username: String
    institution_id: String
  }

  input UserInput {
    id: Int!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateUserInput {
    username: String!
    emailAddress: String!
    firstName: String!
    lastName: String!
    mobileNumber: String
    role_id: String!
    branch_id: String
    institution_id: String
  }

  input UpdateUserInput {
    id: ID!
    username: String!
    emailAddress: String!
    firstName: String!
    lastName: String!
    mobileNumber: String
    role_id: String!
    branch_id: String
    institution_id: String
  }

  input ActivateUserInput {
    id: ID!
  }

  input DeactivateUserInput {
    id: ID!
  }

  input DeleteUserInput {
    id: ID!
  }

  input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
    confirmPassword: String!
  }

  input ResetPasswordInput {
    email: String!
  }

  type User {
    id: ID!
    emailAddress: String!
    firstName: String!
    lastName: String!
    username: String
    status: Boolean
    firstLogin: Boolean
    mobileNumber: String
    role_id: String
    role: Role
    branch_id: String
    branch: Branch
    institution_id: String
    institution: Institution
  }

  type UsersResponse {
    count: Int!
    rows: [User!]
  }

  type UserAuth {
    token: String!
    user: User!
    verticalMenuItems: [RoleFunction!]
  }
`;

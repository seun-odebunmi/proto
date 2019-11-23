import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_USERS_QUERY = gql`
  query Users($input: UsersInput!) {
    users(input: $input) {
      count
      rows {
        id
        emailAddress
        firstName
        lastName
        mobileNumber
        username
        status
        role_id
        role {
          id
          name
          description
        }
        branch_id
        branch {
          id
          name
          code
        }
        institution_id
        institution {
          id
          name
          code
          isISW
          country_id
          country {
            id
            name
          }
        }
      }
    }
  }
`

export const CREATE_USER_QUERY = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      description
    }
  }
`

export const UPDATE_USER_QUERY = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      success
      description
    }
  }
`

export const ACTIVATE_USER_QUERY = gql`
  mutation ActivateUser($input: ActivateUserInput!) {
    activateUser(input: $input) {
      success
      description
    }
  }
`

export const DEACTIVATE_USER_QUERY = gql`
  mutation DeactivateUser($input: DeactivateUserInput!) {
    deactivateUser(input: $input) {
      success
      description
    }
  }
`

export const DELETE_USER_QUERY = gql`
  mutation DeleteUser($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      success
      description
    }
  }
`

interface MutateResponse {
  success: string
  description: string
}

export interface IDeleteUser {
  (body: { id: number }): Observable<MutateResponse>
}

export interface IDeactivateUser {
  (body: { id: number }): Observable<MutateResponse>
}

export interface IActivateUser {
  (body: { id: number }): Observable<MutateResponse>
}

interface IUpdateUserBody {
  username: string
  emailAddress: string
  mobileNumber: string
  firstName: string
  lastName: string
  role_id: number
  id: number
}

export interface IUpdateUser {
  (body: IUpdateUserBody): Observable<MutateResponse>
}

interface ICreateUserBody {
  username: string
  emailAddress: string
  mobileNumber: string
  firstName: string
  lastName: string
  role_id: number
}

export interface ICreateUser {
  (body: ICreateUserBody): Observable<MutateResponse>
}

interface IInstitution {
  id: number
  name: string
  code: string
  isISW: boolean
}

interface IBranch {
  id: number
  name: string
  code: string
}

interface IRole {
  id: number
  name: string
  description: string
}

interface IPortalUser {
  id: number
  emailAddress: string
  firstName: string
  lastName: string
  mobileNumber: string
  username: string
  status: string
  role_id: string
  role: IRole
  branch_id: string
  branch: IBranch
  institution_id: string
  institution: IInstitution
}

interface IGetUsersReturn {
  rows: IPortalUser[]
  count: number
}

interface IGetUsersBody {
  pageNumber: number
  pageSize?: number
  userName?: string
  institution_id?: string
}

export interface IGetUsers {
  (body: IGetUsersBody): Observable<IGetUsersReturn>
}

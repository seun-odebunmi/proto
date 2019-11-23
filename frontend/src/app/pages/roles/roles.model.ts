import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_ROLES_QUERY = gql`
  query Roles($input: RolesInput!) {
    roles(input: $input) {
      count
      rows {
        id
        name
        description
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

export const CREATE_ROLE_QUERY = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      success
      description
    }
  }
`

export const UPDATE_ROLE_QUERY = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      success
      description
    }
  }
`

interface MutateResponse {
  success: boolean
  description: string
}

interface IUpdateRoleBody {
  name: string
  description: string
  id: number
}

export interface IUpdateRole {
  (body: IUpdateRoleBody): Observable<MutateResponse>
}

interface ICreateRoleBody {
  name: string
  description: string
  institution_id?: string
}

export interface ICreateRole {
  (body: ICreateRoleBody): Observable<MutateResponse>
}

interface IInstitution {
  id: number
  name: string
  code: string
  isISW: boolean
}

interface IRole {
  id: number
  name: string
  description: string
  institution_id: string
  institution: IInstitution
}

interface IGetRolesReturn {
  count: number
  rows: IRole[]
}

interface IGetRolesBody {
  pageNumber: number
  pageSize?: number
  institution_id?: string
}

export interface IGetRoles {
  (body?: IGetRolesBody): Observable<IGetRolesReturn>
}

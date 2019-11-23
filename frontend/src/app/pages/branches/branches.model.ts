import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_BRANCHES_QUERY = gql`
  query Branches($input: BranchesInput!) {
    branches(input: $input) {
      count
      rows {
        id
        name
        activeStatus
        code
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

export const CREATE_BRANCH_QUERY = gql`
  mutation CreateBranch($input: CreateBranchInput!) {
    createBranch(input: $input) {
      success
      description
    }
  }
`

export const UPDATE_BRANCH_QUERY = gql`
  mutation UpdateBranch($input: UpdateBranchInput!) {
    updateBranch(input: $input) {
      success
      description
    }
  }
`

export const ACTIVATE_BRANCH_QUERY = gql`
  mutation ActivateBranch($input: ActivateBranchInput!) {
    activateBranch(input: $input) {
      success
      description
    }
  }
`

export const DEACTIVATE_BRANCH_QUERY = gql`
  mutation DeactivateBranch($input: DeactivateBranchInput!) {
    deactivateBranch(input: $input) {
      success
      description
    }
  }
`

interface MutateResponse {
  success: string
  description: string
}

export interface IDeactivateBranch {
  (body: { id: number }): Observable<MutateResponse>
}

export interface IActivateBranch {
  (body: { id: number }): Observable<MutateResponse>
}

interface IUpdateBranchBody {
  name: string
  branchCode: string
  institution_id?: string
  id: number
}

export interface IUpdateBranch {
  (body: IUpdateBranchBody): Observable<MutateResponse>
}

interface ICreateBranchBody {
  name: string
  branchCode: string
  institution_id?: string
}

export interface ICreateBranch {
  (body: ICreateBranchBody): Observable<MutateResponse>
}

interface IInstitution {
  id: number
  name: string
  code: string
  isISW: boolean
}

interface IBranch {
  branchCode: string
  id: number
  name: string
  activeStatus: boolean
  institution_id: string
  institution: IInstitution
}

interface IGetBranchesReturn {
  rows: IBranch[]
  count: number
}

interface IGetBranchesBody {
  pageNumber: number
  pageSize?: number
  institution_id?: string
}

export interface IGetBranches {
  (body?: IGetBranchesBody): Observable<IGetBranchesReturn>
}

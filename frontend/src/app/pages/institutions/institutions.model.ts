import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_INSTITUTIONS_QUERY = gql`
  query Institutions($input: InstitutionsInput!) {
    institutions(input: $input) {
      count
      rows {
        id
        name
        code
        accentColor
        logo
        isISW
        country_id
        country {
          id
          name
          code
        }
      }
    }
  }
`

export const CREATE_INSTITUTION_QUERY = gql`
  mutation CreateInstitution($input: CreateInstitutionInput!) {
    createInstitution(input: $input) {
      success
      description
    }
  }
`

export const UPDATE_INSTITUTION_QUERY = gql`
  mutation UpdateInstitution($input: UpdateInstitutionInput!) {
    updateInstitution(input: $input) {
      success
      description
    }
  }
`
interface MutateResponse {
  success: string
  description: string
}

interface IUpdateInstitutionBody {
  name: string
  code: string
  accentColor: string
  logo: string
  id: number
}

export interface IUpdateInstitution {
  (body: IUpdateInstitutionBody): Observable<MutateResponse>
}

interface ICreateInstitutionBody {
  name: string
  code: string
  accentColor: string
  logo: string
}

export interface ICreateInstitution {
  (body: ICreateInstitutionBody): Observable<MutateResponse>
}

interface ICountry {
  name: string
  code: string
  active: boolean
}

interface IInstitution {
  id: number
  name: string
  code: string
  accentColor: string
  logo: string
  isISW: boolean
  country_id: string
  country: ICountry
}

interface IGetInstitutionsReturn {
  rows: IInstitution[]
  count: number
}

interface IGetInstitutionsBody {
  pageNumber: number
  pageSize?: number
  country_id?: string
}

export interface IGetInstitutions {
  (body?: IGetInstitutionsBody): Observable<IGetInstitutionsReturn>
}

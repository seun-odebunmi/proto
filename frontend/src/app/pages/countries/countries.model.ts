import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_COUNTRIES_QUERY = gql`
  query Countrys($input: CountriesInput!) {
    countries(input: $input) {
      count
      rows {
        id
        name
        code
        active
      }
    }
  }
`

export const CREATE_COUNTRY_QUERY = gql`
  mutation CreateCountry($input: CreateCountryInput!) {
    createCountry(input: $input) {
      success
      description
    }
  }
`

export const UPDATE_COUNTRY_QUERY = gql`
  mutation UpdateCountry($input: UpdateCountryInput!) {
    updateCountry(input: $input) {
      success
      description
    }
  }
`

export const ACTIVATE_COUNTRY_QUERY = gql`
  mutation ActivateCountry($input: ActivateCountryInput!) {
    activateCountry(input: $input) {
      success
      description
    }
  }
`

export const DEACTIVATE_COUNTRY_QUERY = gql`
  mutation DeactivateCountry($input: DeactivateCountryInput!) {
    deactivateCountry(input: $input) {
      success
      description
    }
  }
`

interface MutateResponse {
  success: string
  description: string
}

export interface IDeactivateCountry {
  (body: { id: number }): Observable<MutateResponse>
}

export interface IActivateCountry {
  (body: { id: number }): Observable<MutateResponse>
}

interface IUpdateCountryBody {
  name: string
  code: string
  id: number
}

export interface IUpdateCountry {
  (body: IUpdateCountryBody): Observable<MutateResponse>
}

interface ICreateCountryBody {
  name: string
  code: string
}

export interface ICreateCountry {
  (body: ICreateCountryBody): Observable<MutateResponse>
}

interface ICountry {
  id: number
  name: string
  code: string
  active: boolean
}

interface IGetCountriesReturn {
  rows: ICountry[]
  count: number
}

interface IGetCountriesBody {
  pageNumber: number
  pageSize?: number
  name?: string
  active?: boolean
}

export interface IGetCountries {
  (body?: IGetCountriesBody): Observable<IGetCountriesReturn>
}

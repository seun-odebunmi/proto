import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateCountry,
  ICreateCountry,
  IGetCountries,
  IActivateCountry,
  IDeactivateCountry,
  GET_COUNTRIES_QUERY,
  CREATE_COUNTRY_QUERY,
  UPDATE_COUNTRY_QUERY,
  ACTIVATE_COUNTRY_QUERY,
  DEACTIVATE_COUNTRY_QUERY
} from './countries.model'

@Injectable()
export class CountriesService {
  constructor(private apiCall: ApiCallService) {}

  getCountries: IGetCountries = (body = { pageNumber: 1 }) => {
    return this.apiCall
      .query(GET_COUNTRIES_QUERY, body)
      .map(res => res.countries)
  }

  createCountry: ICreateCountry = body => {
    return this.apiCall
      .mutate(CREATE_COUNTRY_QUERY, body)
      .map(res => res.createCountry)
  }

  updateCountry: IUpdateCountry = body => {
    return this.apiCall
      .mutate(UPDATE_COUNTRY_QUERY, body)
      .map(res => res.updateCountry)
  }

  activateCountry: IActivateCountry = body => {
    return this.apiCall
      .mutate(ACTIVATE_COUNTRY_QUERY, body)
      .map(res => res.activateUser)
  }

  deactivateCountry: IDeactivateCountry = body => {
    return this.apiCall
      .mutate(DEACTIVATE_COUNTRY_QUERY, body)
      .map(res => res.deactivateUser)
  }
}

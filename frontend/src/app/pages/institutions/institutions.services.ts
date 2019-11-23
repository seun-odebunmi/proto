import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateInstitution,
  ICreateInstitution,
  IGetInstitutions,
  GET_INSTITUTIONS_QUERY,
  CREATE_INSTITUTION_QUERY,
  UPDATE_INSTITUTION_QUERY
} from './institutions.model'

@Injectable()
export class InstitutionService {
  constructor(private apiCall: ApiCallService) {}

  getInstitutions: IGetInstitutions = (body = { pageNumber: 1 }) => {
    return this.apiCall
      .query(GET_INSTITUTIONS_QUERY, body)
      .map(res => res.institutions)
  }

  createInstitution: ICreateInstitution = body => {
    return this.apiCall
      .mutate(CREATE_INSTITUTION_QUERY, body)
      .map(res => res.createInstitution)
  }

  updateInstitution: IUpdateInstitution = body => {
    return this.apiCall
      .mutate(UPDATE_INSTITUTION_QUERY, body)
      .map(res => res.updateInstitution)
  }
}

import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { IGetProfile, GET_USER_QUERY } from './profile.model'

@Injectable()
export class ProfileService {
  constructor(private apiCall: ApiCallService) {}

  getProfile: IGetProfile = body => {
    return this.apiCall.query(GET_USER_QUERY, body).map(res => res.user)
  }
}

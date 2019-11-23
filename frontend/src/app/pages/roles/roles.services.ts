import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateRole,
  ICreateRole,
  IGetRoles,
  GET_ROLES_QUERY,
  CREATE_ROLE_QUERY,
  UPDATE_ROLE_QUERY
} from './roles.model'

@Injectable()
export class RoleService {
  constructor(private apiCall: ApiCallService) {}

  getRoles: IGetRoles = (body = { pageNumber: 1 }) => {
    return this.apiCall.query(GET_ROLES_QUERY, body).map(res => res.roles)
  }

  createRole: ICreateRole = body => {
    return this.apiCall
      .mutate(CREATE_ROLE_QUERY, body)
      .map(res => res.createRole)
  }

  updateRole: IUpdateRole = body => {
    return this.apiCall
      .mutate(UPDATE_ROLE_QUERY, body)
      .map(res => res.updateRole)
  }
}

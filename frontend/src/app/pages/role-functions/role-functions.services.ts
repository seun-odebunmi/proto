import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import {
  IGetMenus,
  IGetRoleFunctions,
  ICreateRoleFunction,
  GET_MENUS_QUERY,
  GET_ROLE_FUNCTIONS_QUERY,
  CREATE_ROLE_FUNCTION_QUERY
} from './role-functions.model'

@Injectable()
export class RoleFunctionService {
  constructor(private apiCall: ApiCallService) {}

  getMenus: IGetMenus = body => {
    return this.apiCall.query(GET_MENUS_QUERY, body).map(res => res.menus)
  }

  getRoleFunctions: IGetRoleFunctions = body => {
    return this.apiCall
      .query(GET_ROLE_FUNCTIONS_QUERY, body)
      .map(res => res.roleFunctions)
  }

  createRoleFunction: ICreateRoleFunction = body => {
    return this.apiCall
      .mutate(CREATE_ROLE_FUNCTION_QUERY, body)
      .map(res => res.createRoleFunction)
  }
}

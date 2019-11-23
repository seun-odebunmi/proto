import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { AppSettings } from '../../app.settings'
import {
  IUpdateUser,
  ICreateUser,
  IGetUsers,
  IActivateUser,
  IDeactivateUser,
  IDeleteUser,
  GET_USERS_QUERY,
  CREATE_USER_QUERY,
  UPDATE_USER_QUERY,
  ACTIVATE_USER_QUERY,
  DEACTIVATE_USER_QUERY,
  DELETE_USER_QUERY
} from './users.model'

@Injectable()
export class UserService {
  constructor(private apiCall: ApiCallService, private settings: AppSettings) {}

  verifyUser(userLoginID: string) {
    return this.apiCall.query('portal/user/verify/' + userLoginID)
  }

  activeDirectory() {
    return this.settings.settings.supportActiveDirectory
  }

  getUsers: IGetUsers = (body = { pageNumber: 1 }) => {
    return this.apiCall.query(GET_USERS_QUERY, body).map(res => res.users)
  }

  createUser: ICreateUser = body => {
    return this.apiCall
      .mutate(CREATE_USER_QUERY, body)
      .map(res => res.createUser)
  }

  updateUser: IUpdateUser = body => {
    return this.apiCall
      .mutate(UPDATE_USER_QUERY, body)
      .map(res => res.updateUser)
  }

  activateUser: IActivateUser = body => {
    return this.apiCall
      .mutate(ACTIVATE_USER_QUERY, body)
      .map(res => res.activateUser)
  }

  deactivateUser: IDeactivateUser = body => {
    return this.apiCall
      .mutate(DEACTIVATE_USER_QUERY, body)
      .map(res => res.deactivateUser)
  }

  deleteUser: IDeleteUser = body => {
    return this.apiCall
      .mutate(DELETE_USER_QUERY, body)
      .map(res => res.deleteUser)
  }
}

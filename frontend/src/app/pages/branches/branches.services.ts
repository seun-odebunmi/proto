import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateBranch,
  ICreateBranch,
  IGetBranches,
  IDeactivateBranch,
  IActivateBranch,
  GET_BRANCHES_QUERY,
  CREATE_BRANCH_QUERY,
  UPDATE_BRANCH_QUERY,
  ACTIVATE_BRANCH_QUERY,
  DEACTIVATE_BRANCH_QUERY
} from './branches.model'

@Injectable()
export class BranchService {
  constructor(private apiCall: ApiCallService) {}

  getBranches: IGetBranches = (body = { pageNumber: 1 }) => {
    return this.apiCall.query(GET_BRANCHES_QUERY, body).map(res => res.branches)
  }

  createBranch: ICreateBranch = body => {
    return this.apiCall
      .mutate(CREATE_BRANCH_QUERY, body)
      .map(res => res.createBranch)
  }

  updateBranch: IUpdateBranch = body => {
    return this.apiCall
      .mutate(UPDATE_BRANCH_QUERY, body)
      .map(res => res.updateBranch)
  }

  activateBranch: IActivateBranch = body => {
    return this.apiCall
      .mutate(ACTIVATE_BRANCH_QUERY, body)
      .map(res => res.activateBranch)
  }

  deactivateBranch: IDeactivateBranch = body => {
    return this.apiCall
      .mutate(DEACTIVATE_BRANCH_QUERY, body)
      .map(res => res.deactivateBranch)
  }
}

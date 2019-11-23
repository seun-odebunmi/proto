import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IEnrollCustomer,
  IGetEnrolledCust,
  IVerifyAccountNumber,
  IVerifyAccountNumberReturn,
  IGetEnrolledCustReturn
} from './inbranch-enrollment.model'

@Injectable()
export class InbranchEnrollmentService {
  constructor(private apiCall: ApiCallService) {}

  enrollCust(body: IEnrollCustomer) {
    return this.apiCall.post('portal/customer/enrollment/initiate', body)
  }

  getEnrolledCust(body: IGetEnrolledCust): Observable<IGetEnrolledCustReturn> {
    return this.apiCall.post('portal/customer/enrollment', body)
  }

  verifyAccountNumber(
    body: IVerifyAccountNumber
  ): Observable<IVerifyAccountNumberReturn> {
    return this.apiCall.post(`portal/customer/verify`, body)
  }
}

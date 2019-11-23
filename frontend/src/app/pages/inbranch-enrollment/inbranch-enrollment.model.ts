export interface IEnrolledCustomers {
  customerFirstName: string
  customerLastName: string
  accountNumber: string
  mobileNumbers: string
  bankID: string
}

export interface IEnrollCustomer {
  accountNumber: string
  mobileNumber: string
}

export interface IGetEnrolledCust {
  pageNumber: number
  pageSize: number
  accountNumber: string
}

export interface IGetEnrolledCustReturn {
  code: number
  description: string
  totalRecordCount: number
  enrollments: [IEnrolledCustomers]
}

export interface IVerifyAccountNumber {
  accountNumber: string
  mobileNumber: string
}

export interface IVerifyAccountNumberReturn {
  bankId: string
  code: number
  description: string
  firstname: string
  lastname: string
  registeredPhoneNumbers: []
}

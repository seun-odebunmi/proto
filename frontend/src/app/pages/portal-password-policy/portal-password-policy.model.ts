import { Observable } from 'rxjs'

export interface IPolicies {
  app: boolean
  id: number
  message: string
  name: string
  portal: boolean
}

interface GetPasswordPolicyResponse {
  code: number
  description: string
  policies: IPolicies[]
}

export interface IGetPasswordPolicy {
  (): Observable<GetPasswordPolicyResponse>
}

export interface ISavePasswordPolicy {
  (body: number[]): Observable<any>
}

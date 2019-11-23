import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const RESET_PASSWORD_QUERY = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      description
    }
  }
`

interface MutateResponse {
  success: boolean
  description: string
}

interface IResetPasswordBody {
  email: string
}

export interface IResetPassword {
  (body: IResetPasswordBody): Observable<MutateResponse>
}

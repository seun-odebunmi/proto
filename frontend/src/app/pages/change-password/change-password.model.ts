import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const CHANGE_PASSWORD_QUERY = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      description
    }
  }
`

interface IChangePasswordReturn {
  success: boolean
  description: string
}

interface IChangePasswordBody {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface IChangePassword {
  (body: IChangePasswordBody): Observable<IChangePasswordReturn>
}

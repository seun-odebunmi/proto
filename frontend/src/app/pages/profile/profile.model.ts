import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_USER_QUERY = gql`
  query User($input: UserInput!) {
    user(input: $input) {
      emailAddress
      firstName
      lastName
      mobileNumber
      username
      role {
        name
      }
      branch {
        name
      }
      institution {
        name
      }
    }
  }
`

interface IInstitution {
  name
}

interface IRole {
  name: string
}

interface IBranch {
  name: string
}

interface IGetProfileReturn {
  emailAddress: string
  firstName: string
  lastName: string
  mobileNumber: string
  username: string
  branch: IBranch
  role: IRole
  institution: IInstitution
}

interface IGetProfileBody {
  id: number
}

export interface IGetProfile {
  (body: IGetProfileBody): Observable<IGetProfileReturn>
}

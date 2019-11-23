import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const LOGIN_QUERY = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        emailAddress
        firstName
        lastName
        firstLogin
        role {
          id
          name
        }
        branch {
          id
          name
        }
        institution {
          id
          name
          accentColor
          logo
          isISW
        }
      }
      verticalMenuItems {
        role_id
        menu {
          id
          hasSubMenu
          href
          icon
          routerLink
          target
          title
          parent_id
        }
      }
    }
  }
`

interface IRole {
  id: string
  name: string
}

interface IBranch {
  id: string
  name: string
}

interface IInstitution {
  id: string
  name: string
  accentColor: string
  logo: string
  isISW: boolean
}

interface IUser {
  id: string
  emailAddress: string
  firstName: string
  lastName: string
  firstLogin: boolean
  role: IRole
  branch: IBranch
  institution: IInstitution
}

interface IMenu {
  id: string
  hasSubMenu: boolean
  href: string
  icon: string
  routerLink: string
  target: string
  title: string
  parent_id: string
}

interface IVerticalMenuItems {
  role_id: string
  menu: IMenu
}

interface ILoginReturn {
  token: string
  user: IUser
  verticalMenuItems: IVerticalMenuItems[]
}

interface ILoginBody {
  email: string
  password: string
  authToken?: string
}

export interface ILogin {
  (body: ILoginBody): Observable<ILoginReturn>
}

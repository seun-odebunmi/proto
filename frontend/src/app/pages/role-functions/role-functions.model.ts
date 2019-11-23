import { Observable } from 'rxjs/Observable'
import gql from 'graphql-tag'

export const GET_MENUS_QUERY = gql`
  query Menus($input: MenuInput) {
    menus(input: $input) {
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
`

export const GET_ROLE_FUNCTIONS_QUERY = gql`
  query RoleFunctions($input: RoleFunctionsInput!) {
    roleFunctions(input: $input) {
      role_id
      menu_id
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
`

export const CREATE_ROLE_FUNCTION_QUERY = gql`
  mutation CreateRoleFunction($input: CreateRoleFunctionInput!) {
    createRoleFunction(input: $input) {
      success
      description
    }
  }
`

interface MutateResponse {
  success: string
  description: string
}

interface ICreateRoleFunctionBody {
  role_id: string
  menu_ids: string[]
}

export interface ICreateRoleFunction {
  (body: ICreateRoleFunctionBody): Observable<MutateResponse>
}

interface IGetRoleFunctionsReturn {
  role_id: string
  menu_id: string
  menu: IGetMenusReturn
}

interface IGetRoleFunctionsBody {
  role_id: string
}

export interface IGetRoleFunctions {
  (body: IGetRoleFunctionsBody): Observable<IGetRoleFunctionsReturn[]>
}

interface IGetMenusReturn {
  id: string
  hasSubMenu: boolean
  href: string
  icon: string
  routerLink: string
  target: string
  title: string
  parent_id: string
}

interface IGetMenuBody {
  institution_id: string
}

export interface IGetMenus {
  (body?: IGetMenuBody): Observable<IGetMenusReturn[]>
}

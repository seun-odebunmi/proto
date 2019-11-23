import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { RoleFunctionService } from './role-functions.services'
import { InstitutionService } from '../institutions/institutions.services'
import { CountriesService } from '../countries/countries.services'
import { RoleService } from '../roles/roles.services'
import { AuthService } from '../../services/auth.service'
import { LoaderService } from '../../services/loader.service'
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  FormControl
} from '@angular/forms'
import { trimSpacesValidate } from '../../validators'

@Component({
  selector: 'app-role',
  templateUrl: './role-functions.component.html',
  styleUrls: ['./role-functions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoleFunctionComponent implements OnInit {
  public roleForm: FormGroup
  public role_id: AbstractControl
  public institution_id: AbstractControl
  public country_id: AbstractControl

  isISW: boolean = this.authService.getAuthUserInstitution().isISW
  roles: Array<any>
  institutions: Array<any>
  countries: Array<any>
  menus: Array<any>
  initMenus: Array<any> = []

  constructor(
    public fb: FormBuilder,
    private roleFunctionService: RoleFunctionService,
    private roleService: RoleService,
    private authService: AuthService,
    public loaderService: LoaderService,
    private institutionService: InstitutionService,
    private countriesService: CountriesService
  ) {
    this.roleForm = fb.group({
      role_id: ['', [trimSpacesValidate]]
    })

    if (this.isISW) {
      this.roleForm.addControl('institution_id', new FormControl(''))
      this.roleForm.addControl('country_id', new FormControl(''))
    }

    Object.keys(this.roleForm.controls).map(key => {
      this[key] = this.roleForm.controls[key]
    })
  }

  public onSubmit({ role_id }): void {
    if (this.roleForm.valid) {
      const menu_ids = this.menus
        .filter(({ isChecked }) => isChecked === true)
        .map(({ id }) => id)
      const body = { role_id, menu_ids }

      this.roleFunctionService.createRoleFunction(body).subscribe()
    }
  }

  onChanges(): void {
    if (this.isISW) {
      this.roleForm.get('country_id').valueChanges.subscribe(id => {
        if (id) {
          this.loadInstitutions(id)
        }

        this.roleForm.controls['institution_id'].setValue('')
        this.roleForm.controls['role_id'].setValue('')
      })
      this.roleForm.get('institution_id').valueChanges.subscribe(id => {
        if (id) {
          this.loadRoles(id)
          this.loadMenus(id)
        }

        this.roleForm.controls['role_id'].setValue('')
      })
    }
    this.roleForm.get('role_id').valueChanges.subscribe(id => {
      if (id) {
        const body = { role_id: id }

        this.roleFunctionService.getRoleFunctions(body).subscribe(res => {
          this.menus = this.menus.map(menu => {
            const menuFound = res.find(({ menu_id }) => menu_id === menu.id)

            return { ...menu, isChecked: menuFound ? true : false }
          })
        })
      }
    })
  }

  ngOnInit() {
    this.onChanges()
    if (this.isISW) {
      this.loadCountries()
    } else {
      this.loadRoles()
      this.loadMenus()
    }
  }

  checkForFunctions(): boolean {
    return this.initMenus.length > 0
  }

  onCheckChange(event): void {
    const element = event.target as HTMLInputElement
    const { checked } = element
    const { id, hasSubMenu } = this.menus.find(
      menu => menu.id === element.dataset.id
    )

    this.menus = this.menus.map(menu => ({
      ...menu,
      ...(menu.id === id && { isChecked: checked }),
      ...(hasSubMenu &&
        !menu.hasSubMenu &&
        menu.parent_id === id && { isChecked: checked })
    }))
  }

  loadMenus(institution_id?: string): void {
    const body = { ...(institution_id && { institution_id }) }

    this.roleFunctionService.getMenus(body).subscribe(response => {
      this.initMenus = response
      this.menus = this.initMenus.map(func => ({
        ...func,
        isChecked: false
      }))
    })
  }

  loadRoles(institution_id?: string): void {
    const body = { pageNumber: 1, institution_id }

    this.roleService.getRoles(body).subscribe(response => {
      this.roles = response.rows
    })
  }

  loadInstitutions(country_id: string): void {
    const body = { pageNumber: 1, country_id }

    this.institutionService.getInstitutions(body).subscribe(response => {
      this.institutions = response.rows
    })
  }

  loadCountries(): void {
    this.countriesService.getCountries().subscribe(response => {
      this.countries = response.rows
    })
  }
}

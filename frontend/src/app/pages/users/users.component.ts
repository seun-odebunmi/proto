import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { UserService } from './users.services'
import { RoleService } from '../roles/roles.services'
import { BranchService } from '../branches/branches.services'
import { InstitutionService } from '../institutions/institutions.services'
import { CountriesService } from '../countries/countries.services'
import { AuthService } from '../../services/auth.service'
import { LoaderService } from '../../services/loader.service'
import { TranslateService } from '@ngx-translate/core'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms'

import { GridModel } from '../shared/grid/grid.model'
import { trimSpacesValidate, trimSpaces, emailValidator } from 'app/validators'

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  public modalRef: NgbModalRef
  public userForm: FormGroup
  public username: AbstractControl
  public emailAddress: AbstractControl
  public mobileNumber: AbstractControl
  public firstName: AbstractControl
  public lastName: AbstractControl
  public role_id: AbstractControl
  public branch_id: AbstractControl
  public institution_id: AbstractControl
  public country_id: AbstractControl
  public searchForm: FormGroup
  public institutionSearch: AbstractControl
  public countrySearch: AbstractControl
  public userNameSearch: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  activeDirectory: boolean = this.userService.activeDirectory()
  isISW: boolean = this.authService.getAuthUserInstitution().isISW
  isEdit = false
  isVerifying = false
  readOnlyFields = false
  roles: Array<any>
  branches: Array<any>
  institutions: Array<any>
  countries: Array<any>
  modalAction = ''
  selectedUserId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.firstName'),
      prop: 'firstName'
    },
    {
      name: this.translate.instant('Grid.th.lastName'),
      prop: 'lastName'
    },
    {
      name: this.translate.instant('Labels.username'),
      prop: 'username'
    },
    {
      name: this.translate.instant('Labels.role'),
      prop: 'role.name'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'id',
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private branchService: BranchService,
    private institutionService: InstitutionService,
    private countriesService: CountriesService,
    private authService: AuthService,
    public loaderService: LoaderService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    public translate: TranslateService
  ) {
    this.userForm = fb.group({
      username: ['', [trimSpacesValidate]],
      emailAddress: [
        '',
        Validators.compose([trimSpacesValidate, emailValidator])
      ],
      mobileNumber: ['', [Validators.minLength(9), trimSpaces]],
      firstName: ['', [trimSpacesValidate]],
      lastName: ['', [trimSpacesValidate]],
      role_id: ['', [Validators.required]]
    })

    if (!this.activeDirectory) {
      this.userForm.addControl(
        'branch_id',
        new FormControl('', [Validators.required])
      )
      this.columns.splice(3, 0, {
        name: this.translate.instant('Grid.th.branch'),
        prop: 'branch.name'
      })
    }

    if (this.isISW) {
      this.userForm.addControl(
        'institution_id',
        new FormControl('', [Validators.required])
      )
      this.columns.splice(4, 0, {
        name: this.translate.instant('Labels.institution'),
        prop: 'institution.name'
      })

      this.userForm.addControl(
        'country_id',
        new FormControl('', [Validators.required])
      )
      this.columns.splice(3, 0, {
        name: this.translate.instant('Labels.country'),
        prop: 'institution.country.name'
      })
    }

    Object.keys(this.userForm.controls).map(key => {
      this[key] = this.userForm.controls[key]
    })

    this.searchForm = fb.group({
      countrySearch: ['ALL'],
      institutionSearch: [''],
      userNameSearch: ['']
    })
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.userForm.valid) {
      const { country_id, ...rest } = this.userForm.getRawValue()
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...rest, id: this.selectedUserId }
          : { ...rest }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.userService.updateUser(finalValues)
          : () => this.userService.createUser(finalValues)

      requestMethod().subscribe(response => {
        if (response.success) {
          this.closeModal()
        }
      })
    }
  }

  public verifyUser(): void {
    this.isVerifying = true
    const userName = this.username.value

    this.userService.verifyUser(userName).subscribe(
      data => {
        this.isVerifying = false
        const result = data.portalUserInfo

        Object.keys(this.userForm.controls).map(key => {
          result && result[key]
            ? this.userForm.get(key).setValue(result[key])
            : this.userForm.get(key).setValue('')

          this.userForm.get(key).markAsTouched()
        })
      },
      error => {
        this.isVerifying = false
        this.userForm.reset('')
      }
    )
  }

  openModal(content: string, action: string): void {
    if (
      action === this.translate.instant('Grid.create') &&
      this.activeDirectory
    ) {
      this.readOnlyFields = true
    }
    this.modalAction = action
    this.userForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
    const disableFields = ['country_id', 'institution_id']

    if (this.isISW) {
      disableFields.map(field => {
        this.modalAction === this.translate.instant('Grid.edit')
          ? this.userForm.get(field).disable({ onlySelf: true })
          : this.userForm.get(field).enable({ onlySelf: true })
      })
    }
  }

  closeModal(): void {
    this.modalRef.close()
  }

  onChanges(): void {
    this.userForm.get('country_id').valueChanges.subscribe(id => {
      if (!this.isEdit) {
        this.userForm.controls['institution_id'].setValue('')
        this.userForm.controls['role_id'].setValue('')
        this.userForm.controls['branch_id'].setValue('')
      }

      if (id) {
        this.loadInstitutions(id)
      }
    })
    this.userForm.get('institution_id').valueChanges.subscribe(id => {
      if (!this.isEdit) {
        this.userForm.controls['role_id'].setValue('')
        this.userForm.controls['branch_id'].setValue('')
      }

      if (id) {
        this.loadRoles(id)
        if (!this.activeDirectory) {
          this.loadBranches(id)
        }
      }
    })
    this.searchForm.get('countrySearch').valueChanges.subscribe(id => {
      this.searchForm.controls['institutionSearch'].setValue('')

      if (id) {
        this.loadInstitutions(id)
      }
    })
  }

  ngOnInit() {
    this.loadUsers()
    if (this.isISW) {
      this.loadCountries()
      this.onChanges()
    } else {
      this.loadRoles()
      if (!this.activeDirectory) {
        this.loadBranches()
      }
    }
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(id: number): void {
    this.userService.activateUser({ id }).subscribe()
  }

  deactivate(id: number): void {
    this.userService.deactivateUser({ id }).subscribe()
  }

  deleteUser(id: number): void {
    this.userService.deleteUser({ id }).subscribe()
  }

  edit(row): void {
    this.readOnlyFields = false
    this.selectedUserId = row.id
    this.isEdit = true
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    if (this.isISW) {
      this.userForm.controls['country_id'].setValue(
        row['institution']['country_id']
      )
    }

    for (const key in row) {
      if (this.userForm.controls[key]) {
        this.userForm.controls[key].setValue(row[key])
      }
    }
    this.isEdit = false
  }

  loadRoles(institution_id?: string): void {
    const body = { pageNumber: 1, institution_id }

    this.roleService
      .getRoles(body)
      .subscribe(response => (this.roles = response.rows))
  }

  loadBranches(institution_id?: string): void {
    const body = { pageNumber: 1, activeStatus: true, institution_id }

    this.branchService
      .getBranches(body)
      .subscribe(response => (this.branches = response.rows))
  }

  loadInstitutions(country_id: string): void {
    const body = { pageNumber: 1, country_id }

    this.institutionService
      .getInstitutions(body)
      .subscribe(response => (this.institutions = response.rows))
  }

  loadCountries(): void {
    this.countriesService
      .getCountries()
      .subscribe(response => (this.countries = response.rows))
  }

  syncGridData(gridModel: GridModel): void {
    this.loadUsers(gridModel, true)
  }

  userRequestBody(gridModel: GridModel, that: any) {
    const { userNameSearch, institutionSearch } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      username: userNameSearch.value || '',
      institution_id: institutionSearch.value || ''
    }
  }

  downloadReport(): void {
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.userRequestBody(gridModel, this)

    this.userService
      .getUsers(body)
      .subscribe(data =>
        this.convertToExcelService.exportDataGrid(data.rows, 'Users')
      )
  }

  loadUsers(gridModel: GridModel = this.settings, pagination = false): void {
    const body = this.userRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.userService.getUsers(body).subscribe(data => {
      const settings = { ...gridModel },
        colLen = settings.columns.length

      settings.rows = data.rows
      settings.columns[colLen - 2].cellTemplate = this.statusTmpl
      settings.columns[colLen - 1].cellTemplate = this.actionTmpl
      settings.currentPageNumber = body.pageNumber - 1
      settings.totalElements = data.count
      settings.totalPages = Math.ceil(data.count / body.pageSize)
      this.settings = { ...settings }
    })
  }
}

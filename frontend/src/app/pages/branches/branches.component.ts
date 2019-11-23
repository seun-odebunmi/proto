import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { BranchService } from './branches.services'
import { InstitutionService } from '../institutions/institutions.services'
import { CountriesService } from '../countries/countries.services'
import { TranslateService } from '@ngx-translate/core'
import { AuthService } from '../../services/auth.service'
import { LoaderService } from '../../services/loader.service'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  FormControl
} from '@angular/forms'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-branch',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BranchComponent implements OnInit {
  public modalRef: NgbModalRef
  public branchForm: FormGroup
  public name: AbstractControl
  public code: AbstractControl
  public institution_id: AbstractControl
  public country_id: AbstractControl
  public searchForm: FormGroup
  public institutionSearch: AbstractControl
  public countrySearch: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isISW: boolean = this.authService.getAuthUserInstitution().isISW
  isEdit = false
  modalAction = ''
  institutions: Array<any>
  countries: Array<any>
  selectedBranchId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.branchCode'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'activeStatus',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'id',
      cellTemplate: null
    }
  ]

  constructor(
    public fb: FormBuilder,
    private branchService: BranchService,
    private institutionService: InstitutionService,
    private countriesService: CountriesService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    private authService: AuthService,
    public loaderService: LoaderService,
    public translate: TranslateService
  ) {
    this.branchForm = fb.group({
      name: ['', [trimSpacesValidate]],
      code: ['', [trimSpacesValidate]]
    })

    if (this.isISW) {
      this.branchForm.addControl(
        'institution_id',
        new FormControl('', [trimSpacesValidate])
      )
      this.columns.splice(2, 0, {
        name: this.translate.instant('Labels.institution'),
        prop: 'institution.name'
      })

      this.branchForm.addControl(
        'country_id',
        new FormControl('', [trimSpacesValidate])
      )
      this.columns.splice(3, 0, {
        name: this.translate.instant('Labels.country'),
        prop: 'institution.country.name'
      })
    }

    Object.keys(this.branchForm.controls).map(key => {
      this[key] = this.branchForm.controls[key]
    })

    this.searchForm = fb.group({
      countrySearch: ['ALL'],
      institutionSearch: ['']
    })
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.branchForm.valid) {
      const { country_id, ...rest } = this.branchForm.getRawValue()
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...rest, id: this.selectedBranchId }
          : { ...rest }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.branchService.updateBranch(finalValues)
          : () => this.branchService.createBranch(finalValues)

      requestMethod().subscribe(response => {
        if (response.success) {
          this.closeModal()
        }
      })
    }
  }

  openModal(content: string, action: string): void {
    this.modalAction = action
    this.branchForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
    const disableFields = ['country_id', 'institution_id']

    if (this.isISW) {
      disableFields.map(field => {
        this.modalAction === this.translate.instant('Grid.edit')
          ? this.branchForm.get(field).disable({ onlySelf: true })
          : this.branchForm.get(field).enable({ onlySelf: true })
      })
    }
  }

  closeModal(): void {
    this.modalRef.close()
  }

  onChanges(): void {
    this.branchForm.get('country_id').valueChanges.subscribe(id => {
      if (!this.isEdit) {
        this.branchForm.controls['institution_id'].setValue('')
      }

      if (id) {
        this.loadInstitutions(id)
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
    this.loadBranches()
    if (this.isISW) {
      this.loadCountries()
      this.onChanges()
    }
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(id: number): void {
    this.branchService.activateBranch({ id }).subscribe()
  }

  deactivate(id: number): void {
    this.branchService.deactivateBranch({ id }).subscribe()
  }

  edit(row): void {
    this.selectedBranchId = row.id
    this.isEdit = true
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    if (this.isISW) {
      this.branchForm.controls['country_id'].setValue(
        row['institution']['country_id']
      )
    }

    for (const key in row) {
      if (this.branchForm.controls[key]) {
        this.branchForm.controls[key].setValue(row[key])
      }
    }
    this.isEdit = false
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

  syncGridData(gridModel: GridModel): void {
    this.loadBranches(gridModel, true)
  }

  branchRequestBody(gridModel: GridModel, that: any) {
    const { institutionSearch } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      institution_id: institutionSearch.value || ''
    }
  }

  downloadReport(): void {
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.branchRequestBody(gridModel, this)

    this.branchService.getBranches(body).subscribe(data => {
      this.convertToExcelService.exportDataGrid(data.rows, 'Branches')
    })
  }

  loadBranches(gridModel: GridModel = this.settings, pagination = false): void {
    const body = this.branchRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.branchService.getBranches(body).subscribe(data => {
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

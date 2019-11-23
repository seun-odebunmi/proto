import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { InstitutionService } from './institutions.services'
import { CountriesService } from '../countries/countries.services'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { LoaderService } from '../../services/loader.service'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-institution',
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstitutionComponent implements OnInit {
  public modalRef: NgbModalRef
  public institutionForm: FormGroup
  public name: AbstractControl
  public code: AbstractControl
  public accentColor: AbstractControl
  public logo: AbstractControl
  public country_id: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  modalAction = ''
  countrySearch: string
  countries: Array<any>
  selectedInstitutionId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code',
      minWidth: 200
    },
    {
      name: this.translate.instant('Labels.country'),
      prop: 'country.name'
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'id',
      cellTemplate: null
    }
  ]

  constructor(
    public fb: FormBuilder,
    private institutionService: InstitutionService,
    private countriesService: CountriesService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    public loaderService: LoaderService,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.institutionForm = fb.group({
      name: ['', [trimSpacesValidate]],
      code: ['', [trimSpacesValidate]],
      accentColor: ['', [trimSpacesValidate]],
      logo: ['', [trimSpacesValidate]],
      country_id: ['', [trimSpacesValidate]]
    })
    Object.keys(this.institutionForm.controls).map(key => {
      this[key] = this.institutionForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.institutionForm.valid) {
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...values, id: this.selectedInstitutionId }
          : { ...values }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.institutionService.updateInstitution(finalValues)
          : () => this.institutionService.createInstitution(finalValues)

      requestMethod().subscribe(response => {
        if (response.success) {
          this.closeModal()
        }
      })
    }
  }

  openModal(content: string, action: string): void {
    this.modalAction = action
    this.institutionForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  readAsBase64(file): Promise<any> {
    const { size = 0, type = '' } = file || {}
    const fileSize = parseFloat((size / 1024 / 1024).toFixed(4))
    const reader = new FileReader()
    const fileValue = new Promise((resolve, reject) => {
      reader.onload = () => {
        fileSize === 0 && reject('Cannot read image!')
        type !== 'image/jpeg' && reject('Image must be a jpg file!')
        fileSize > 0.5 && reject('Image exceeds maximum size of 500KB!')

        resolve(reader.result)
      }

      reader.onerror = event => {
        reject(event)
      }

      reader.readAsDataURL(file)
    })

    return fileValue
  }

  onFileChange(event): void {
    const [file = null] = event.target.files || []

    this.readAsBase64(file)
      .then(res => this.institutionForm.controls['logo'].setValue(res))
      .catch(err => {
        this.toastrService.error(err)
        this.institutionForm.controls['logo'].setValue('')
      })
  }

  ngOnInit() {
    this.loadCountries()
    this.loadInstitutions()
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  edit(row): void {
    this.selectedInstitutionId = row.id
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.institutionForm.controls[key]) {
        this.institutionForm.controls[key].setValue(row[key])
      }
    }
  }

  loadCountries(): void {
    const body = { pageNumber: 1, active: true }
    this.countriesService
      .getCountries(body)
      .subscribe(response => (this.countries = response.rows))
  }

  syncGridData(gridModel: GridModel): void {
    this.loadInstitutions(gridModel, true)
  }

  institutionRequestBody(gridModel: GridModel, that: any) {
    const { countrySearch } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      country_id: countrySearch || ''
    }
  }

  downloadReport(): void {
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.institutionRequestBody(gridModel, this)

    this.institutionService
      .getInstitutions(body)
      .subscribe(data =>
        this.convertToExcelService.exportDataGrid(data.rows, 'Institutions')
      )
  }

  loadInstitutions(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    const body = this.institutionRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.institutionService.getInstitutions(body).subscribe(data => {
      const settings = { ...gridModel }
      settings.rows = data.rows
      settings.columns[3].cellTemplate = this.actionTmpl
      settings.currentPageNumber = body.pageNumber - 1
      settings.totalElements = data.count
      settings.totalPages = Math.ceil(data.count / body.pageSize)
      this.settings = { ...settings }
    })
  }
}

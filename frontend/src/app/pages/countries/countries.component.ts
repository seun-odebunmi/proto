import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { CountriesService } from './countries.services'
import { TranslateService } from '@ngx-translate/core'
import { LoaderService } from '../../services/loader.service'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-country',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CountriesComponent implements OnInit {
  public modalRef: NgbModalRef
  public countryForm: FormGroup
  public name: AbstractControl
  public code: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  modalAction = ''
  nameSearch: string
  selectedCountryId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'active',
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
    private countriesService: CountriesService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    public loaderService: LoaderService,
    public translate: TranslateService
  ) {
    this.countryForm = fb.group({
      name: ['', [trimSpacesValidate]],
      code: ['', [trimSpacesValidate]]
    })
    Object.keys(this.countryForm.controls).map(key => {
      this[key] = this.countryForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.countryForm.valid) {
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...values, id: this.selectedCountryId }
          : { ...values }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.countriesService.updateCountry(finalValues)
          : () => this.countriesService.createCountry(finalValues)

      requestMethod().subscribe(response => {
        if (response.success) {
          this.closeModal()
        }
      })
    }
  }

  openModal(content: string, action: string): void {
    this.modalAction = action
    this.countryForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    this.loadCountries()
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(id: number): void {
    this.countriesService.activateCountry({ id }).subscribe()
  }

  deactivate(id: number): void {
    this.countriesService.deactivateCountry({ id }).subscribe()
  }

  edit(row): void {
    this.selectedCountryId = row.id
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.countryForm.controls[key]) {
        this.countryForm.controls[key].setValue(row[key])
      }
    }
  }

  syncGridData(gridModel: GridModel): void {
    this.loadCountries(gridModel, true)
  }

  countryRequestBody(gridModel: GridModel, that: any) {
    const { nameSearch } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      name: nameSearch || ''
    }
  }

  downloadReport(): void {
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.countryRequestBody(gridModel, this)

    this.countriesService
      .getCountries(body)
      .subscribe(data =>
        this.convertToExcelService.exportDataGrid(data.rows, 'Countries')
      )
  }

  loadCountries(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    const body = this.countryRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.countriesService.getCountries(body).subscribe(data => {
      const settings = { ...gridModel }
      settings.rows = data.rows
      settings.columns[2].cellTemplate = this.statusTmpl
      settings.columns[3].cellTemplate = this.actionTmpl
      settings.currentPageNumber = body.pageNumber - 1
      settings.totalElements = data.count
      settings.totalPages = Math.ceil(data.count / body.pageSize)
      this.settings = { ...settings }
    })
  }
}

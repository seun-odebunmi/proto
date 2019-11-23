import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { BillerService } from './billers.services'
import { CategoryService } from '../categories/categories.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-biller',
  templateUrl: './billers.component.html',
  styleUrls: ['./billers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillerComponent implements OnInit {
  public modalRef: NgbModalRef
  public billerForm: FormGroup
  public name: AbstractControl
  public code: AbstractControl
  public gatewayCode: AbstractControl
  public label: AbstractControl
  public productGroup: AbstractControl
  public charge: AbstractControl
  public processor: AbstractControl
  public validationSupported: AbstractControl
  public categoryID: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isRequesting = false
  categories: Array<any>
  billerName: string
  modalAction = ''
  selectedBillerId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'name',
      minWidth: 160
    },
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.gatewayCode'),
      prop: 'gatewayCode'
    },
    {
      name: this.translate.instant('Grid.th.charge'),
      prop: 'charge'
    },
    {
      name: this.translate.instant('Grid.th.label'),
      prop: 'label'
    },
    {
      name: this.translate.instant('Grid.th.processor'),
      prop: 'processor'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'billerID',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private billerService: BillerService,
    private categoryService: CategoryService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.billerForm = fb.group({
      name: ['', [trimSpacesValidate]],
      code: ['', [trimSpacesValidate]],
      gatewayCode: ['', [trimSpacesValidate]],
      label: ['', [trimSpacesValidate]],
      productGroup: ['', [trimSpacesValidate]],
      charge: ['', [trimSpacesValidate]],
      processor: ['', [trimSpacesValidate]],
      validationSupported: [''],
      categoryID: ['', [trimSpacesValidate]]
    })
    Object.keys(this.billerForm.controls).map(key => {
      this[key] = this.billerForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.billerForm.valid) {
      this.isRequesting = true
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...values, billerID: this.selectedBillerId }
          : { ...values }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.billerService.updateBiller(finalValues)
          : () => this.billerService.createBiller(finalValues)

      requestMethod().subscribe(
        response => {
          this.toastrService.success(response.description)
          this.closeModal()
          this.isRequesting = false
        },
        error => {
          this.isRequesting = false
        }
      )
    }
  }

  openModal(content: string, action: string): void {
    this.modalAction = action
    this.billerForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    this.loadBillers()
    this.getCategories()
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(billerID: number): void {
    this.isRequesting = true

    this.billerService.activateBiller(billerID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  deactivate(billerID: number): void {
    this.isRequesting = true

    this.billerService.deactivateBiller(billerID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  edit(row): void {
    this.selectedBillerId = row.billerID
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.billerForm.controls[key]) {
        this.billerForm.controls[key].setValue(row[key])
      }
    }
  }

  getCategories(): void {
    this.isRequesting = true
    const body = {
      pageNumber: 1,
      pageSize: 10,
      categoryName: ''
    }

    this.categoryService.getCategory(body).subscribe(
      response => {
        this.categories = response.categories
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  syncGridData(gridModel: GridModel): void {
    this.loadBillers(gridModel, true)
  }

  billerRequestBody(gridModel: GridModel, that: any) {
    const { billerName } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      billerName: billerName || ''
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.billerRequestBody(gridModel, this)

    this.billerService.getBillers(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.billers, 'Billers')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadBillers(gridModel: GridModel = this.settings, pagination = false): void {
    this.isRequesting = true
    const body = this.billerRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.billerService.getBillers(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.billers
        settings.columns[6].cellTemplate = this.statusTmpl
        settings.columns[7].cellTemplate = this.actionTmpl
        settings.currentPageNumber = body.pageNumber - 1
        settings.totalElements = data.totalRecordCount
        settings.totalPages = Math.ceil(data.totalRecordCount / body.pageSize)
        this.settings = { ...settings }
      },
      error => {
        this.isRequesting = false
      }
    )
  }
}

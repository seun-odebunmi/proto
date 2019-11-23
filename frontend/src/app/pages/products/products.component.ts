import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { ProductService } from './products.services'
import { BillerService } from '../billers/billers.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { DecimalFormat } from '../../services/pipes'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-product',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit {
  public modalRef: NgbModalRef
  public productForm: FormGroup
  public name: AbstractControl
  public code: AbstractControl
  public amountFixed: AbstractControl
  // public minAmount: AbstractControl
  // public maxAmount: AbstractControl
  public amount: AbstractControl
  public gatewayCode: AbstractControl
  public processor: AbstractControl
  public billerID: AbstractControl
  public searchForm: FormGroup
  public productNameSearch: AbstractControl
  public billerIdSearch: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isRequesting = false
  billers: Array<any>
  modalAction = ''
  selectedProductId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Labels.productName'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.amount'),
      prop: 'amount',
      pipe: new DecimalFormat('en-US')
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'productID',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private productService: ProductService,
    private billerService: BillerService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.searchForm = fb.group({
      billerIdSearch: ['', [trimSpacesValidate]],
      productNameSearch: ['']
    })
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.productForm = fb.group({
      name: ['', [trimSpacesValidate]],
      code: ['', [trimSpacesValidate]],
      amountFixed: [''],
      // minAmount: ['', [ trimSpacesValidate ]],
      // maxAmount: ['', [ trimSpacesValidate ]],
      amount: ['', [trimSpacesValidate]],
      gatewayCode: ['', [trimSpacesValidate]],
      processor: ['', [trimSpacesValidate]],
      billerID: ['', [trimSpacesValidate]]
    })
    Object.keys(this.productForm.controls).map(key => {
      this[key] = this.productForm.controls[key]
    })
    this.settings = new GridModel(this.columns)
    this.settings.pageSize = 10
  }

  public onSubmit(values: any): void {
    if (this.productForm.valid) {
      this.isRequesting = true
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...values, productID: this.selectedProductId }
          : { ...values }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.productService.updateProduct(finalValues)
          : () => this.productService.createProduct(finalValues)

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
    this.productForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    // this.loadProducts()
    this.getBillers()
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(productID: number): void {
    this.isRequesting = true

    this.productService.activateProduct(productID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  deactivate(productID: number): void {
    this.isRequesting = true

    this.productService.deactivateProduct(productID).subscribe(
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
    this.selectedProductId = row.productID
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.productForm.controls[key]) {
        this.productForm.controls[key].setValue(row[key])
      }
    }
  }

  getBillers(): void {
    this.isRequesting = true

    this.billerService.getAllBillers().subscribe(
      response => {
        this.billers = response.billers
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  syncGridData(gridModel: GridModel) {
    this.loadProducts(gridModel, true)
  }

  productRequestBody(gridModel: GridModel, that: any) {
    const { productNameSearch, billerIdSearch } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      productName: productNameSearch.value || '',
      billerID: billerIdSearch.value || ''
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.productRequestBody(gridModel, this)

    this.productService.getProducts(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.products, 'Products')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadProducts(gridModel: GridModel = this.settings, pagination = false): void {
    this.isRequesting = true
    const body = this.productRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.productService.getProducts(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.products
        settings.columns[3].cellTemplate = this.statusTmpl
        settings.columns[4].cellTemplate = this.actionTmpl
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

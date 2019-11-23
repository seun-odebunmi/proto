import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { CustomerLimitService } from './customer-limits.services'
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder
} from '@angular/forms'
import { DecimalFormat } from '../../services/pipes'

import { GridModel } from '../shared/grid/grid.model'
import { trimSpacesValidate } from 'app/validators'

@Component({
  selector: 'app-password-reset',
  templateUrl: './customer-limits.component.html',
  styleUrls: ['./customer-limits.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerLimitComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public searchValue: AbstractControl
  public searchType: AbstractControl
  public setLimitForm: FormGroup
  public daily: AbstractControl
  public perTransaction: AbstractControl
  public name: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  supportPerTransactionLimit: boolean = this.customerLimitService.supportPerTransactionLimit()
  limitTypes: Array<any>
  filteredLimitTypes: Array<any> = []
  isRequesting = false
  selectedLimitID: number
  selectedCustomerID: number
  modalAction = ''
  customerInfo: {} = null
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.dailyLimit'),
      prop: 'daily',
      pipe: new DecimalFormat('en-US')
    },
    // {
    //   name: 'Limit per Transaction',
    //   prop: 'perTransaction',
    //   pipe: new DecimalFormat('en-US')
    // },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'limitID',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private customerLimitService: CustomerLimitService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.searchForm = fb.group({
      searchValue: ['', [trimSpacesValidate]],
      searchType: ['', [trimSpacesValidate]]
    })
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.setLimitForm = fb.group({
      daily: ['', [trimSpacesValidate]],
      name: ['', [trimSpacesValidate]]
    })
    if (this.supportPerTransactionLimit) {
      this.setLimitForm.addControl(
        'perTransaction',
        new FormControl('', [trimSpacesValidate])
      )
      this.columns.splice(3, 0, {
        name: this.translate.instant('Grid.th.limitPerTrans'),
        prop: 'perTransaction',
        pipe: new DecimalFormat('en-US')
      })
    }
    Object.keys(this.setLimitForm.controls).map(key => {
      this[key] = this.setLimitForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.setLimitForm.valid) {
      this.isRequesting = true
      const body =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...values, limitID: this.selectedLimitID }
          : { ...values, customerID: this.selectedCustomerID }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.customerLimitService.updateCustomerLimit(body)
          : () => this.customerLimitService.createCustomerLimit(body)

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
    this.setLimitForm.reset()
    if (action === this.translate.instant('Grid.edit')) {
      this.setLimitForm.controls['name'].disable()
    } else {
      this.setLimitForm.controls['name'].enable()
    }
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    this.getLimitTypes()
  }

  getLimitTypes(): void {
    this.isRequesting = true
    this.customerLimitService.getCustomerLimitTypes().subscribe(
      response => {
        this.limitTypes = response.settings
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  canCreateLimit(): boolean {
    return this.filteredLimitTypes.length > 0
  }

  edit(row): void {
    this.selectedLimitID = row.limitID
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.setLimitForm.controls[key]) {
        this.setLimitForm.controls[key].setValue(row[key])
      }
    }
  }

  delete(row): void {
    this.isRequesting = true
    this.customerLimitService.deleteCustomerLimit(row.limitID).subscribe(
      response => {
        this.toastrService.success(response.description)
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  syncGridData(gridModel: GridModel): void {
    this.loadCustomerLimit(gridModel, true)
  }

  custLimitRequestBody(gridModel: GridModel, that: any) {
    const { searchValue } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      [this.searchType.value]: searchValue.value || ''
    }
  }

  loadCustomerLimit(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.custLimitRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.customerLimitService.searchCustomerLimit(body).subscribe(
      data => {
        this.isRequesting = false
        this.filteredLimitTypes = this.limitTypes.filter(
          limit => !data.limits.some(item => item.name === limit.code)
        )
        this.customerInfo = data.customerInfo
        this.selectedCustomerID = data.customerInfo.customerID
        const settings = { ...gridModel },
          colLen = settings.columns.length
        settings.rows = data.limits
        settings.columns[colLen - 1].cellTemplate = this.actionTmpl
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

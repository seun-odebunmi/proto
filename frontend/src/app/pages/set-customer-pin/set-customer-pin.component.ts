import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { MatDialog } from '@angular/material'
import { DialogBoxComponent } from '../shared/dialog-box/dialog-box.component'
import { SetCustomerPinService } from './set-customer-pin.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import { CardMask } from '../../services/pipes'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-customer',
  templateUrl: './set-customer-pin.component.html',
  styleUrls: ['./set-customer-pin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SetCustomerPinComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public userLoginID: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isRequesting = false
  modalAction = ''
  reqAdditionalInfo: string
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.cardType'),
      prop: 'cardType'
    },
    {
      name: this.translate.instant('Grid.th.cardHolderName'),
      prop: 'cardHolderName'
    },
    {
      name: this.translate.instant('Grid.th.cardCategory'),
      prop: 'cardCategory'
    },
    {
      name: this.translate.instant('Grid.th.cardNumber'),
      prop: 'cardNumber',
      pipe: new CardMask()
    },
    {
      name: this.translate.instant('Grid.th.currency'),
      prop: 'currency'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'customerID',
      cellTemplate: null,
      cellClass: ({ row }) => {
        return { 'display-none': row.regStatus === 'REGISTRATION_STARTED' }
      }
    }
  ]

  constructor(
    fb: FormBuilder,
    private setCustomerPinService: SetCustomerPinService,
    private modalService: NgbModal,
    private convertToExcelService: ConvertToExcelService,
    private toastrService: ToastrService,
    public translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.searchForm = fb.group({
      userLoginID: ['', [trimSpacesValidate]]
    })
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  openModal(content: string, action: string): void {
    this.modalAction = action
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {}

  viewMore(row): void {
    this.reqAdditionalInfo = row.additionalParams
    return this.openModal(
      this.content,
      `${this.translate.instant('Labels.viewMore')} ${row['customerName']}`
    )
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  setPin(row): void {
    this.isRequesting = true
    const { cardNumber, expiryDate } = row
    const body = {
      customerusername: this.userLoginID.value || '',
      cardNumber,
      expiryDate
    }

    this.setCustomerPinService.setCustomerPin(body).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  syncGridData(gridModel: GridModel): void {
    this.loadCustomerCards(gridModel, true)
  }

  customerRequestBody(gridModel: GridModel, that: any) {
    const { userLoginID } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      userLoginID: userLoginID.value || ''
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.customerRequestBody(gridModel, this)

    this.setCustomerPinService.getCustomerCards(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.cards, 'Customer Cards')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadCustomerCards(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.customerRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.setCustomerPinService.getCustomerCards(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.cards
        settings.columns[5].cellTemplate = this.statusTmpl
        settings.columns[6].cellTemplate = this.actionTmpl
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

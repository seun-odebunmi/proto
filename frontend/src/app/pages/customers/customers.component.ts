import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import {
  NgbModal,
  NgbModalRef,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap'
import { MatDialog } from '@angular/material'
import { DialogBoxComponent } from '../shared/dialog-box/dialog-box.component'
import { CustomerService } from './customers.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { HelperService } from '../../services/helper.service'
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import * as moment from 'moment'
import { dateLessThan, trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-customer',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public startDate: AbstractControl
  public endDate: AbstractControl
  public regStatus: AbstractControl
  public accountNumber: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  canReleaseCustomer: boolean = this.customerService.canReleaseCustomer()
  isRequesting = false
  modalAction = ''
  reqAdditionalInfo: string
  regStatuses = Array<any>()
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.regDate'),
      prop: 'regStarted'
    },
    {
      name: this.translate.instant('Grid.th.lastLogin'),
      prop: 'lastLogin'
    },
    {
      name: this.translate.instant('Labels.accountNumber'),
      prop: 'primaryAccountNumber'
    },
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'customerName'
    },
    {
      name: this.translate.instant('Labels.username'),
      prop: 'username'
    },
    {
      name: this.translate.instant('Labels.regStatus'),
      prop: 'regStatus'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'enabled',
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
    private customerService: CustomerService,
    private modalService: NgbModal,
    private convertToExcelService: ConvertToExcelService,
    private toastrService: ToastrService,
    public translate: TranslateService,
    private helperService: HelperService,
    private dialog: MatDialog
  ) {
    this.searchForm = fb.group(
      {
        startDate: [''],
        endDate: [''],
        regStatus: ['ALL', [trimSpacesValidate]],
        accountNumber: ['']
      },
      { validator: dateLessThan('startDate', 'endDate') }
    )
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

  ngOnInit() {
    this.loadRegistrationStatus()
  }

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

  activate(customerID: number): void {
    this.isRequesting = true

    this.customerService.activateCustomer(customerID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  deactivate(customerID: number): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      data: { title: `Confirm Deactivation` }
    })

    dialogRef.afterClosed().subscribe(result => {
      const reason = result

      if (reason) {
        this.isRequesting = true

        this.customerService.deactivateCustomer(customerID, reason).subscribe(
          response => {
            this.isRequesting = false
            this.toastrService.success(response.description)
            this.loadCustomers()
          },
          error => {
            this.isRequesting = false
          }
        )
      }
    })
  }

  releaseCustomer(customerID: number): void {
    this.isRequesting = true

    this.customerService.releaseCustomer(customerID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadRegistrationStatus(): void {
    this.isRequesting = true
    this.customerService.getRegistrationStatus().subscribe(
      response => {
        this.regStatuses = response.regStatuses
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  updateDate(newVal: NgbDateStruct, curr: AbstractControl): void {
    curr.setValue(newVal)
  }

  syncGridData(gridModel: GridModel): void {
    this.loadCustomers(gridModel, true)
  }

  customerRequestBody(gridModel: GridModel, that: any) {
    const { startDate, endDate, regStatus, accountNumber } = that,
      { currentPageNumber, pageSize } = gridModel,
      sDate = this.helperService.formatDateInput(startDate.value),
      eDate = this.helperService.formatDateInput(endDate.value, true)

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      accountNumber: accountNumber.value || null,
      regStatus: regStatus.value || null,
      startDate: sDate,
      endDate: eDate
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.customerRequestBody(gridModel, this)

    this.customerService.getCustomers(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.customers, 'Customers')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadCustomers(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.customerRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.customerService.getCustomers(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.customers
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

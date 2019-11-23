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
import { ServiceRequestService } from './service-request.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import * as moment from 'moment'
import { dateLessThan, trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-customer',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServiceRequestComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public startDate: AbstractControl
  public endDate: AbstractControl
  public reqStatus: AbstractControl
  public accountNumber: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isRequesting = false
  modalAction = ''
  reqAdditionalInfo
  reqStatuses = Array<any>()
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.requestDate'),
      prop: 'dateCreated'
    },
    {
      name: this.translate.instant('Labels.accountNumber'),
      prop: 'accountNumber'
    },
    {
      name: this.translate.instant('Grid.th.charge'),
      prop: 'chargeAmount'
    },
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'customerFullname'
    },
    {
      name: this.translate.instant('Labels.mobileNumber'),
      prop: 'phoneNumber'
    },
    {
      name: this.translate.instant('Labels.requestType'),
      prop: 'requestType'
    },
    {
      name: this.translate.instant('Labels.reqStatus'),
      prop: 'requestStatus',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'serviceRequestID',
      width: '100px',
      cellTemplate: null,
      cellClass: ({ row }) => {
        return { 'display-none': row.reqStatus === 'REGISTRATION_STARTED' }
      }
    }
  ]

  constructor(
    fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.searchForm = fb.group(
      {
        startDate: [''],
        endDate: [''],
        reqStatus: ['ALL', [trimSpacesValidate]],
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
    this.reqAdditionalInfo = JSON.parse(row.additionalInfo)
    this.openModal(
      this.content,
      `${this.translate.instant('Labels.viewMore')} ${row.accountNumber}`
    )
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  approve(serviceRequestID: number): void {
    this.isRequesting = true

    this.serviceRequestService.approve(serviceRequestID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  decline(serviceRequestID: number): void {
    this.isRequesting = true

    this.serviceRequestService.decline(serviceRequestID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  changeStatus(serviceRequestID: number): void {
    this.isRequesting = true

    this.serviceRequestService.changeStatus(serviceRequestID).subscribe(
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
    this.serviceRequestService.getRequestStatus().subscribe(
      response => {
        this.reqStatuses = response.serviceRequestStatuses
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
    this.loadServiceRequests(gridModel, true)
  }

  formatReqStatus(status: string) {
    let css = ''
    if (status === 'PENDING') {
      css = 'badge-warning'
    }
    if (status === 'IN_PROGRESS') {
      css = 'badge-info'
    }
    if (status === 'COMPLETED_APPROVED') {
      css = 'badge-success'
    }
    if (status === 'COMPLETED_DECLINED') {
      css = 'badge-danger'
    }
    return `badge ${css}`
  }

  customerRequestBody(gridModel: GridModel, that: any) {
    const { startDate, endDate, reqStatus, accountNumber } = that,
      { currentPageNumber, pageSize } = gridModel,
      sDate = startDate.value
        ? moment(
            new Date(
              startDate.value.year,
              startDate.value.month - 1,
              startDate.value.day
            )
          ).format('MM/DD/YYYY HH:mm:ss')
        : '',
      eDate = endDate.value
        ? moment(
            new Date(
              endDate.value.year,
              endDate.value.month - 1,
              endDate.value.day,
              23,
              59,
              59
            )
          ).format('MM/DD/YYYY HH:mm:ss')
        : ''

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      accountNumber: accountNumber.value || '',
      reqStatus: reqStatus.value || '',
      startDate: sDate,
      endDate: eDate
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.customerRequestBody(gridModel, this)

    this.serviceRequestService.getRequestServices(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(
          data.serviceRequests,
          'Service Requests'
        )
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadServiceRequests(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.customerRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.serviceRequestService.getRequestServices(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.serviceRequests
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

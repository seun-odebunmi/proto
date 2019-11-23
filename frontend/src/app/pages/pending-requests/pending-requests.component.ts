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
import { PendingRequestService } from './pending-requests.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { TranslateService } from '@ngx-translate/core'
import { LoaderService } from '../../services/loader.service'
import { HelperService } from '../../services/helper.service'
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import { dateLessThan } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-pending-request',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PendingRequestComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public startDate: AbstractControl
  public endDate: AbstractControl
  public requestType: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  requestTypes = Array<any>()
  modalAction = ''
  reqAdditionalInfo
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.requestDate'),
      prop: 'requestDate'
    },
    {
      name: this.translate.instant('Labels.requestType'),
      prop: 'requestType'
    },
    {
      name: this.translate.instant('Grid.th.initEmail'),
      prop: 'requestorEmail'
    },
    {
      name: this.translate.instant('Grid.th.initUsername'),
      prop: 'requestor'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'id',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private pendingRequestService: PendingRequestService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    public loaderService: LoaderService,
    private helperService: HelperService,
    public translate: TranslateService
  ) {
    this.searchForm = fb.group(
      {
        startDate: [''],
        endDate: [''],
        requestType: ['']
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
    this.loadRequestTypes()
    this.loadPendingRequests()
  }

  viewMore(row): void {
    this.reqAdditionalInfo = JSON.parse(row.additionalInfo)
    this.openModal(
      this.content,
      `${this.translate.instant('Labels.viewMore')} ${row.requestType}`
    )
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  approvePortalReq(requestId: number): void {
    const body = { requestId }

    this.pendingRequestService
      .approvePortalRequest(body)
      .subscribe(response => this.loadPendingRequests())
  }

  approve(requestId: number): void {
    this.pendingRequestService
      .approveRequest(requestId)
      .subscribe(response => this.loadPendingRequests())
  }

  declinePortalReq(requestId: number): void {
    const body = { requestId }

    this.pendingRequestService
      .declinePortalRequest(body)
      .subscribe(response => this.loadPendingRequests())
  }

  decline(requestId: number): void {
    this.pendingRequestService
      .declineRequest(requestId)
      .subscribe(response => this.loadPendingRequests())
  }

  loadRequestTypes(): void {
    this.pendingRequestService
      .getRequestTypes()
      .subscribe(response => (this.requestTypes = response))
  }

  updateDate(newVal: NgbDateStruct, curr: AbstractControl): void {
    curr.setValue(newVal)
  }

  syncGridData(gridModel: GridModel): void {
    this.loadPendingRequests(gridModel, true)
  }

  pendRequestBody(gridModel: GridModel, that: any) {
    const { startDate, endDate, requestType } = that,
      { currentPageNumber, pageSize } = gridModel,
      sDate = this.helperService.formatDateInput(startDate.value),
      eDate = this.helperService.formatDateInput(endDate.value, true)

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      requestType: requestType.value || '',
      startDate: sDate,
      endDate: eDate
    }
  }

  downloadReport(): void {
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.pendRequestBody(gridModel, this)

    this.pendingRequestService
      .getPendingRequests(body)
      .subscribe(data =>
        this.convertToExcelService.exportDataGrid(data.rows, 'PendingRequests')
      )
  }

  loadPendingRequests(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    const body = this.pendRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.pendingRequestService.getPendingRequests(body).subscribe(data => {
      const settings = { ...gridModel }
      settings.rows = data.rows
      settings.columns[4].cellTemplate = this.statusTmpl
      settings.columns[5].cellTemplate = this.actionTmpl
      settings.currentPageNumber = body.pageNumber - 1
      settings.totalElements = data.count
      settings.totalPages = Math.ceil(data.count / body.pageSize)
      this.settings = { ...settings }
    })
  }
}

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
import { TranslateService } from '@ngx-translate/core'
import { AuditLogService } from './audit-logs.services'
import { PendingRequestService } from '../pending-requests/pending-requests.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { LoaderService } from '../../services/loader.service'
import { HelperService } from '../../services/helper.service'
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import { dateLessThan, trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuditLogComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public startDate: AbstractControl
  public endDate: AbstractControl
  public sourceAccount: AbstractControl
  public actionOn: AbstractControl
  public actionBy: AbstractControl
  public auditType: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  auditTypes = Array<any>()
  modalAction = ''
  reqAdditionalInfo
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.auditDate'),
      prop: 'createDate'
    },
    {
      name: this.translate.instant('Labels.auditType'),
      prop: 'auditType'
    },
    {
      name: this.translate.instant('Labels.actionBy'),
      prop: 'actionBy'
    },
    {
      name: this.translate.instant('Labels.actionOn'),
      prop: 'actionOn'
    },
    {
      name: this.translate.instant('Labels.sourceAccount'),
      prop: 'sourceAccount'
    },
    {
      name: this.translate.instant('Grid.th.userComp'),
      prop: 'userIp'
    },
    {
      name: this.translate.instant('Labels.reqStatus'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'id',
      minWidth: 100,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private auditLogService: AuditLogService,
    private pendingRequestService: PendingRequestService,
    private modalService: NgbModal,
    private convertToExcelService: ConvertToExcelService,
    public loaderService: LoaderService,
    private helperService: HelperService,
    public translate: TranslateService
  ) {
    this.searchForm = fb.group(
      {
        startDate: ['', [trimSpacesValidate]],
        endDate: ['', [trimSpacesValidate]],
        sourceAccount: [''],
        actionOn: [''],
        actionBy: [''],
        auditType: ['']
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
    this.loadAuditTypes()
  }

  getAddInfoTypeObj(): boolean {
    return typeof this.reqAdditionalInfo === 'object'
  }

  getAddInfoTypeStr(): boolean {
    return typeof this.reqAdditionalInfo === 'string'
  }

  viewMore(row): void {
    try {
      this.reqAdditionalInfo = JSON.parse(row.details)
    } catch (e) {
      this.reqAdditionalInfo = row.details
    }

    this.openModal(
      this.content,
      `${this.translate.instant('Labels.viewMore')} ${row.auditType}`
    )
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  loadAuditTypes(): void {
    this.pendingRequestService
      .getRequestTypes()
      .subscribe(response => (this.auditTypes = response))
  }

  updateDate(newVal: NgbDateStruct, curr: AbstractControl): void {
    curr.setValue(newVal)
  }

  syncGridData(gridModel: GridModel): void {
    this.loadAuditLogs(gridModel, true)
  }

  auditRequestBody(gridModel: GridModel, that: any) {
    const {
        startDate,
        endDate,
        sourceAccount,
        actionOn,
        actionBy,
        auditType
      } = that,
      { currentPageNumber, pageSize } = gridModel,
      sDate = this.helperService.formatDateInput(startDate.value),
      eDate = this.helperService.formatDateInput(endDate.value, true)

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      sourceAccount: sourceAccount.value || '',
      actionOn: actionOn.value || '',
      actionBy: actionBy.value || '',
      auditType: auditType.value || '',
      startDate: sDate,
      endDate: eDate
    }
  }

  downloadReport(): void {
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.auditRequestBody(gridModel, this)

    this.auditLogService
      .getAuditLogs(body)
      .subscribe(data =>
        this.convertToExcelService.exportDataGrid(data.rows, 'AuditLogs')
      )
  }

  loadAuditLogs(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    const body = this.auditRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.auditLogService.getAuditLogs(body).subscribe(data => {
      const settings = { ...gridModel }
      settings.rows = data.rows
      settings.columns[6].cellTemplate = this.statusTmpl
      settings.columns[7].cellTemplate = this.actionTmpl
      settings.currentPageNumber = body.pageNumber - 1
      settings.totalElements = data.count
      settings.totalPages = Math.ceil(data.count / body.pageSize)
      this.settings = { ...settings }
    })
  }
}

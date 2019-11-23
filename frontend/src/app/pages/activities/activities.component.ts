import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import {
  NgbModal,
  NgbModalRef,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap'
import { ActivityService } from './activities.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { dateLessThan, trimSpacesValidate } from '../../validators'
import * as moment from 'moment'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-activity',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivityComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public startDate: AbstractControl
  public endDate: AbstractControl
  public sourceAccount: AbstractControl
  public customerID: AbstractControl
  public searchForm2: FormGroup
  public startDate2: AbstractControl
  public endDate2: AbstractControl

  canGenerateReport: boolean = this.activityService.canGenerateReport()
  isRequesting = false
  modalAction = ''
  selectedBranchId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: 'Customer Name',
      prop: 'customerName'
    },
    {
      name: 'Device',
      prop: 'device'
    },
    {
      name: 'Transaction Count',
      prop: 'transactionCount'
    },
    {
      name: 'Account Number',
      prop: 'accountNumber'
    },
    {
      name: 'Session Date',
      prop: 'sessionStartDate'
    },
    {
      name: 'Session Duration (mins)',
      prop: 'sessionPeriod'
    }
  ]

  @ViewChild('content')
  private content

  constructor(
    public fb: FormBuilder,
    private modalService: NgbModal,
    private activityService: ActivityService,
    private convertToExcelService: ConvertToExcelService
  ) {
    this.searchForm = fb.group(
      {
        startDate: ['', [trimSpacesValidate]],
        endDate: ['', [trimSpacesValidate]],
        sourceAccount: [''],
        customerID: ['']
      },
      { validator: dateLessThan('startDate', 'endDate') }
    )
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.searchForm2 = fb.group(
      {
        startDate2: ['', [trimSpacesValidate]],
        endDate2: ['', [trimSpacesValidate]]
      },
      { validator: dateLessThan('startDate2', 'endDate2') }
    )
    Object.keys(this.searchForm2.controls).map(key => {
      this[key] = this.searchForm2.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  openModal(content: string): void {
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    // this.loadActivities()
  }

  generateReport() {
    this.openModal(this.content)
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  updateDate(newVal: NgbDateStruct, curr: AbstractControl): void {
    curr.setValue(newVal)
  }

  syncGridData(gridModel: GridModel): void {
    this.loadActivities(gridModel, true)
  }

  reportRequestBody(that: any) {
    const { startDate2, endDate2 } = that,
      sDate = startDate2.value
        ? moment(
            new Date(
              startDate2.value.year,
              startDate2.value.month - 1,
              startDate2.value.day
            )
          ).format('MM/DD/YYYY HH:mm:ss')
        : '',
      eDate = endDate2.value
        ? moment(
            new Date(
              endDate2.value.year,
              endDate2.value.month - 1,
              endDate2.value.day,
              23,
              59,
              59
            )
          ).format('MM/DD/YYYY HH:mm:ss')
        : ''

    return {
      startDate: sDate,
      endDate: eDate
    }
  }

  loadReport() {
    this.isRequesting = true
    const body = this.reportRequestBody(this)

    this.activityService.getReportData(body).subscribe(
      data => {
        this.convertToExcelService.exportDataGrid(data.reports, 'Report')
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  activityRequestBody(gridModel: GridModel, that: any) {
    const { startDate, endDate, sourceAccount, customerID } = that,
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
      sourceAccount: sourceAccount.value || '',
      customerID: customerID.value || '',
      startDate: sDate,
      endDate: eDate
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.activityRequestBody(gridModel, this)

    this.activityService.getActivities(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.activities, 'Activities')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadActivities(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.activityRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.activityService.getActivities(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.activities
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

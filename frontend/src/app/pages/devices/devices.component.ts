import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { DeviceService } from './devices.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators
} from '@angular/forms'
import * as moment from 'moment'
import { dateLessThan } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-device',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceComponent implements OnInit {
  public searchForm: FormGroup
  public customerID: AbstractControl
  public accountNumber: AbstractControl
  public startDate: AbstractControl
  public endDate: AbstractControl

  @ViewChild('devStateTmpl')
  devStateTmpl: TemplateRef<any>
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isRequesting = false
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.activationDate'),
      prop: 'activationStarted'
    },
    {
      name: this.translate.instant('Grid.th.deviceName'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.model'),
      prop: 'model'
    },
    {
      name: this.translate.instant('Grid.th.customer'),
      prop: 'customerUsername'
    },
    {
      name: this.translate.instant('Grid.th.deviceState'),
      prop: 'deviceState',
      minWidth: 160,
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'enabled',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'deviceID',
      minWidth: 260,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private deviceService: DeviceService,
    private convertToExcelService: ConvertToExcelService,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.searchForm = fb.group(
      {
        startDate: [''],
        endDate: [''],
        customerID: [''],
        accountNumber: ['']
      },
      {
        validator: Validators.compose([dateLessThan('startDate', 'endDate')])
      }
    )
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  ngOnInit() {
    const gridModel = { ...this.settings, pageSize: 50 }
    this.loadDevices(gridModel)
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(deviceID: number): void {
    this.isRequesting = true

    this.deviceService.activateDevice(deviceID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  deactivate(deviceID: number): void {
    this.isRequesting = true

    this.deviceService.deactivateDevice(deviceID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  releaseDevice(deviceID: number): void {
    this.isRequesting = true

    this.deviceService.releaseDevice(deviceID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
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
    this.loadDevices(gridModel, true)
  }

  deviceRequestBody(gridModel: GridModel, that: any) {
    const { startDate, endDate, customerID, accountNumber } = that,
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
      customerID: customerID.value || '',
      accountNumber: accountNumber.value || '',
      startDate: sDate,
      endDate: eDate
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.deviceRequestBody(gridModel, this)

    this.deviceService.getDevices(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.devices, 'Devices')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadDevices(gridModel: GridModel = this.settings, pagination = false): void {
    this.isRequesting = true
    const body = this.deviceRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.deviceService.getDevices(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.devices
        settings.columns[4].cellTemplate = this.devStateTmpl
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

import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { InbranchEnrollmentService } from './inbranch-enrollment.services'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'

import { trimSpacesValidate } from '../../validators'
import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-inbranch-enrollment',
  templateUrl: './inbranch-enrollment.component.html',
  styleUrls: ['./inbranch-enrollment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InbranchEnrollmentComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public accountNumberSearch: AbstractControl
  public mobileNumberSearch: AbstractControl

  @ViewChild('content')
  private content

  isVerified = false
  isRequesting = false
  customerInfo = {}
  modalAction = ''
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.firstName'),
      prop: 'customerFirstName'
    },
    {
      name: this.translate.instant('Grid.th.lastName'),
      prop: 'customerLastName'
    },
    {
      name: this.translate.instant('Labels.mobileNumber'),
      prop: 'mobileNumbers'
    }
  ]

  constructor(
    fb: FormBuilder,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    private inbranchEnrollmentService: InbranchEnrollmentService,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.searchForm = fb.group({
      accountNumberSearch: ['', [trimSpacesValidate]],
      mobileNumberSearch: ['', [trimSpacesValidate]]
    })
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.settings = new GridModel(this.columns)
    this.settings.pageSize = 10
  }

  verifyAccount() {
    if (this.searchForm.valid) {
      this.isRequesting = true
      const body = {
        accountNumber: this.accountNumberSearch.value,
        mobileNumber: this.mobileNumberSearch.value
      }

      this.inbranchEnrollmentService.verifyAccountNumber(body).subscribe(
        data => {
          const { firstname, lastname, registeredPhoneNumbers } = data
          this.customerInfo = { firstname, lastname, registeredPhoneNumbers }
          this.openModal(this.content, this.translate.instant('Grid.enroll'))
          this.isRequesting = false
        },
        error => {
          this.isRequesting = false
        }
      )
    }
  }

  enrollCustomer() {
    const body = {
      accountNumber: this.accountNumberSearch.value,
      mobileNumber: this.mobileNumberSearch.value
    }
    this.isRequesting = true

    this.inbranchEnrollmentService.enrollCust(body).subscribe(
      data => {
        this.isRequesting = false
        this.closeModal()
        this.toastrService.success(data.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  openModal(content: string, action: string): void {
    this.modalAction = action
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    this.loadEnrolledCust()
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  syncGridData(gridModel: GridModel): void {
    this.loadEnrolledCust(gridModel, true)
  }

  enrolRequestBody(gridModel: GridModel, that: any) {
    const { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      accountNumber: null
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.enrolRequestBody(gridModel, this)

    this.inbranchEnrollmentService.getEnrolledCust(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(
          data.enrollments,
          'Enrolled Customers'
        )
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadEnrolledCust(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.enrolRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.inbranchEnrollmentService.getEnrolledCust(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.enrollments
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

import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { BankService } from './banks.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-bank',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BankComponent implements OnInit {
  public modalRef: NgbModalRef
  public bankForm: FormGroup
  public name: AbstractControl
  public code: AbstractControl
  public gatewayCode: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isRequesting = false
  bankName: string
  modalAction = ''
  selectedBankId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.gatewayCode'),
      prop: 'gatewayCode'
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'bankID',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private bankService: BankService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.bankForm = fb.group({
      name: ['', [trimSpacesValidate]],
      code: ['', [trimSpacesValidate]],
      gatewayCode: ['', [trimSpacesValidate]]
    })
    Object.keys(this.bankForm.controls).map(key => {
      this[key] = this.bankForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.bankForm.valid) {
      this.isRequesting = true
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...values, bankID: this.selectedBankId }
          : { ...values }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.bankService.updateBank(finalValues)
          : () => this.bankService.createBank(finalValues)

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
    this.bankForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    this.loadBanks()
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(bankID: number): void {
    this.isRequesting = true

    this.bankService.activateBank(bankID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  deactivate(bankID: number): void {
    this.isRequesting = true

    this.bankService.deactivateBank(bankID).subscribe(
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
    this.selectedBankId = row.bankID
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.bankForm.controls[key]) {
        this.bankForm.controls[key].setValue(row[key])
      }
    }
  }

  syncGridData(gridModel: GridModel): void {
    this.loadBanks(gridModel, true)
  }

  bankRequestBody(gridModel: GridModel, that: any) {
    const { bankName } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      bankName: bankName || ''
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.bankRequestBody(gridModel, this)

    this.bankService.getBanks(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.banks, 'Banks')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadBanks(gridModel: GridModel = this.settings, pagination = false): void {
    this.isRequesting = true
    const body = this.bankRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.bankService.getBanks(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.banks
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

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
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { TransactionService } from './transactions.services'
import { TranslateService } from '@ngx-translate/core'
import { LoaderService } from '../../services/loader.service'
import { HelperService } from '../../services/helper.service'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { AuthService } from '../../services/auth.service'
import { DecimalFormat } from '../../services/pipes'
import { dateLessThan, trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionComponent implements OnInit {
  public modalRef: NgbModalRef
  public searchForm: FormGroup
  public transType: AbstractControl
  public sourceAccount: AbstractControl
  public startDate: AbstractControl
  public endDate: AbstractControl
  public searchValue: AbstractControl
  public searchType: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  useTransactionFilters: boolean = this.transactionService.useTransactionFilters()
  institutionId: string = this.authService.decodeToken().user.institution_id
  modalAction = ''
  reqAdditionalInfo: string
  transTypes = Array<any>()
  filterParams = Array<any>()
  defaultParam = Array<any>()
  filterParam = Array<any>()
  settings: GridModel
  columns = [
    {
      name: this.translate.instant('Grid.th.date'),
      prop: 'date'
    },
    {
      name: this.translate.instant('Labels.sourceAccount'),
      prop: 'sourceAccount'
    },
    {
      name: this.translate.instant('Grid.th.amount'),
      prop: 'amount',
      pipe: new DecimalFormat('en-US')
    },
    {
      name: this.translate.instant('Grid.th.status'),
      prop: 'status',
      cellTemplate: null
    },
    {
      name: this.translate.instant('Grid.th.responseCode'),
      prop: 'responseCode'
    },
    {
      name: this.translate.instant('Grid.th.responseDesc'),
      prop: 'responseDescription'
    },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'transactionID',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private transactionService: TransactionService,
    private modalService: NgbModal,
    private convertToExcelService: ConvertToExcelService,
    public translate: TranslateService,
    public loaderService: LoaderService,
    private helperService: HelperService,
    public authService: AuthService
  ) {
    this.searchForm = fb.group(
      {
        startDate: ['', [trimSpacesValidate]],
        endDate: ['', [trimSpacesValidate]],
        transType: ['', [trimSpacesValidate]],
        sourceAccount: [''],
        searchValue: [''],
        searchType: ['']
      },
      {
        validator: dateLessThan('startDate', 'endDate')
      }
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
    this.loadTransactionTypes()
    if (this.useTransactionFilters) {
      this.loadFilterParams()
    }
    this.onChanges()
  }

  viewMore(row): void {
    this.reqAdditionalInfo = row.additionalParams
    this.openModal(
      this.content,
      `${this.translate.instant('Labels.viewMore')} ${
        row.additionalParams['Transaction Type']
      }`
    )
  }

  checkGridDataLoad() {
    return this.settings.rows.length > 0
  }

  loadTransactionTypes(): void {
    this.transactionService
      .getTransactionTypes()
      .subscribe(response => (this.transTypes = response.transactionTypes))
  }

  loadFilterParams(): void {
    this.transactionService.getFilterParams().subscribe(res => {
      this.filterParams = [...res.transactionTypes]
      const filteredParam = this.filterParams.find(
        trans => trans.transactionType === 'ALL'
      )

      this.filterParam =
        filteredParam &&
        filteredParam.filters.map(item => {
          const key = Object.keys(item)[0]
          return { key, label: item[key] }
        })

      this.defaultParam = [...this.filterParam]
    })
  }

  onChanges(): void {
    this.searchForm.get('transType').valueChanges.subscribe(val => {
      const filteredParam = this.filterParams.find(
        trans => trans.transactionType === val
      )

      this.filterParam = filteredParam
        ? filteredParam.filters.map(item => {
            const key = Object.keys(item)[0]
            return { key, label: item[key] }
          })
        : [...this.defaultParam]
    })
  }

  updateDate(newVal: NgbDateStruct, curr: AbstractControl): void {
    curr.setValue(newVal)
  }

  syncGridData(gridModel: GridModel) {
    this.loadTransactions(gridModel, true)
  }

  transRequestBody(gridModel: GridModel, that: any) {
    const {
        startDate,
        endDate,
        transType,
        sourceAccount,
        searchValue,
        searchType,
        institutionId
      } = that,
      { currentPageNumber, pageSize } = gridModel,
      sDate = this.helperService.formatDateInput(startDate.value),
      eDate = this.helperService.formatDateInput(endDate.value, true)

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      institutionId,
      filterKey: searchType.value || '',
      filterValue: searchValue.value || '',
      transTypeCode: transType.value || '',
      sourceAccount: sourceAccount.value || '',
      startDate: sDate,
      endDate: eDate
    }
  }

  downloadReport(): void {
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.transRequestBody(gridModel, this)

    this.transactionService
      .getTransactions(body)
      .subscribe(data =>
        this.convertToExcelService.exportDataGrid(
          data.transactions,
          'Transactions'
        )
      )
  }

  loadTransactions(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    const body = this.transRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.transactionService.getTransactions(body).subscribe(data => {
      const settings = { ...gridModel }
      settings.rows = data.transactions
      settings.columns[3].cellTemplate = this.statusTmpl
      settings.columns[6].cellTemplate = this.actionTmpl
      settings.currentPageNumber = body.pageNumber - 1
      settings.totalElements = data.totalRecordCount
      settings.totalPages = Math.ceil(data.totalRecordCount / body.pageSize)
      this.settings = { ...settings }
    })
  }
}

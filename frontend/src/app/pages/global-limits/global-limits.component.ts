import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { GlobalLimitService } from './global-limits.services'
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder
} from '@angular/forms'
import { DecimalFormat } from '../../services/pipes'

import { GridModel } from '../shared/grid/grid.model'
import { trimSpacesValidate } from 'app/validators'

@Component({
  selector: 'app-password-reset',
  templateUrl: './global-limits.component.html',
  styleUrls: ['./global-limits.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalLimitComponent implements OnInit {
  public modalRef: NgbModalRef
  public setLimitForm: FormGroup
  public daily: AbstractControl
  public perTransaction: AbstractControl
  public name: AbstractControl
  public count: AbortController

  supportPerTransactionLimit: boolean = this.globalLimitService.supportPerTransactionLimit()
  limitTypes: Array<any>
  isRequesting = false
  selectedSettingID: any
  modalAction = ''
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.dailyLimit'),
      prop: 'daily',
      pipe: new DecimalFormat('en-US')
    },
    // {
    //   name: 'Limit per Transaction',
    //   prop: 'perTransaction',
    //   pipe: new DecimalFormat('en-US')
    // },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'settingID',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  @ViewChild('content')
  private content
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  constructor(
    fb: FormBuilder,
    private globalLimitService: GlobalLimitService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.setLimitForm = fb.group({
      daily: ['', [trimSpacesValidate]],
      name: ['', [trimSpacesValidate]],
      count: ['', [trimSpacesValidate]]
    })
    if (this.supportPerTransactionLimit) {
      this.setLimitForm.addControl(
        'perTransaction',
        new FormControl('', [trimSpacesValidate])
      )
      this.columns.splice(3, 0, {
        name: this.translate.instant('Grid.th.limitPerTrans'),
        prop: 'perTransaction',
        pipe: new DecimalFormat('en-US')
      })
    }
    Object.keys(this.setLimitForm.controls).map(key => {
      this[key] = this.setLimitForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.setLimitForm.valid) {
      this.isRequesting = true
      const body = {
        ...values,
        settingID: this.selectedSettingID,
        name: this.setLimitForm.controls['name'].value
      }

      this.globalLimitService.updateGlobalLimit(body).subscribe(
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
    this.setLimitForm.reset()
    if (action === this.translate.instant('Grid.edit')) {
      this.setLimitForm.controls['name'].disable()
    }
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  ngOnInit() {
    this.getLimitTypes()
  }

  getLimitTypes(): void {
    this.isRequesting = true
    this.globalLimitService.getGlobalLimitTypes().subscribe(
      response => {
        this.limitTypes = response.settings
        this.isRequesting = false
        this.loadGlobalLimit()
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  edit(row): void {
    this.selectedSettingID = row.settingID
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.setLimitForm.controls[key]) {
        this.setLimitForm.controls[key].setValue(row[key])
      }
    }
  }

  syncGridData(gridModel: GridModel): void {
    this.loadGlobalLimit(gridModel, true)
  }

  globalLimitRequestBody(gridModel: GridModel, that: any) {
    const { searchValue } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize
    }
  }

  loadGlobalLimit(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.globalLimitRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.globalLimitService.searchGlobalLimit(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel },
          colLen = settings.columns.length
        settings.rows = data.settings
        settings.columns[colLen - 1].cellTemplate = this.actionTmpl
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

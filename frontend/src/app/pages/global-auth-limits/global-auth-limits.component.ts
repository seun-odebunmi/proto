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
import { GlobalAuthLimitService } from './global-auth-limits.services'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { DecimalFormat } from '../../services/pipes'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-password-reset',
  templateUrl: './global-auth-limits.component.html',
  styleUrls: ['./global-auth-limits.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalAuthLimitComponent implements OnInit {
  public modalRef: NgbModalRef
  public setLimitForm: FormGroup
  public perTranLimit: AbstractControl
  public authMode: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  limitTypes: Array<any>
  isRequesting = false
  selectedLimitID: any
  modalAction = ''
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Grid.th.id'),
      prop: 'id'
    },
    {
      name: this.translate.instant('Grid.th.name'),
      prop: 'authMode'
    },
    {
      name: this.translate.instant('Grid.th.limitPerTrans'),
      prop: 'perTranLimit',
      pipe: new DecimalFormat('en-US')
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
    private globalAuthLimitService: GlobalAuthLimitService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.setLimitForm = fb.group({
      perTranLimit: ['', [trimSpacesValidate]],
      authMode: ['', [trimSpacesValidate]]
    })
    Object.keys(this.setLimitForm.controls).map(key => {
      this[key] = this.setLimitForm.controls[key]
    })
    this.settings = new GridModel(this.columns, 10)
  }

  public onSubmit(values: any): void {
    if (this.setLimitForm.valid) {
      this.isRequesting = true
      const body = { ...values, id: this.selectedLimitID }

      this.globalAuthLimitService.updateGlobalAuthLimit(body).subscribe(
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
      this.setLimitForm.controls['authMode'].disable()
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
    this.globalAuthLimitService.getGlobalAuthLimitTypes().subscribe(
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
    this.selectedLimitID = row.id
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

    this.globalAuthLimitService.searchGlobalAuthLimit(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.limits
        settings.columns[3].cellTemplate = this.actionTmpl
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

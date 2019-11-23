import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { CategoryService } from './categories.services'
import { ConvertToExcelService } from '../../services/convert-to-excel.service'
import { ToastrService } from 'ngx-toastr'
import { trimSpacesValidate } from '../../validators'

import { GridModel } from '../shared/grid/grid.model'

@Component({
  selector: 'app-category',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {
  public modalRef: NgbModalRef
  public categoryForm: FormGroup
  public name: AbstractControl
  public code: AbstractControl
  public description: AbstractControl
  // public status: AbstractControl
  public gatewayCode: AbstractControl

  @ViewChild('content')
  private content
  @ViewChild('statusTmpl')
  statusTmpl: TemplateRef<any>
  @ViewChild('actionTmpl')
  actionTmpl: TemplateRef<any>

  isRequesting = false
  categoryName: string
  modalAction = ''
  selectedCategoryId: number
  settings: GridModel
  columns: Array<any> = [
    {
      name: this.translate.instant('Labels.categoryName'),
      prop: 'name'
    },
    {
      name: this.translate.instant('Grid.th.code'),
      prop: 'code'
    },
    {
      name: this.translate.instant('Grid.th.description'),
      prop: 'description'
    },
    {
      name: this.translate.instant('Grid.th.gatewayCode'),
      prop: 'gatewayCode'
    },
    // {
    //   name: 'Status',
    //   prop: 'status',
    //   cellTemplate: null
    // },
    {
      name: this.translate.instant('Grid.th.action'),
      prop: 'categoryID',
      minWidth: 160,
      cellTemplate: null
    }
  ]

  constructor(
    fb: FormBuilder,
    private categoryService: CategoryService,
    private convertToExcelService: ConvertToExcelService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    public translate: TranslateService
  ) {
    this.categoryForm = fb.group({
      name: ['', [trimSpacesValidate]],
      code: ['', [trimSpacesValidate]],
      description: ['', [trimSpacesValidate]],
      // status: [''],
      gatewayCode: ['', [trimSpacesValidate]]
    })
    Object.keys(this.categoryForm.controls).map(key => {
      this[key] = this.categoryForm.controls[key]
    })
    this.settings = new GridModel(this.columns)
    this.settings.pageSize = 10
  }

  public onSubmit(values: any): void {
    if (this.categoryForm.valid) {
      this.isRequesting = true
      const finalValues =
        this.modalAction === this.translate.instant('Grid.edit')
          ? { ...values, categoryID: this.selectedCategoryId }
          : { ...values }
      const requestMethod =
        this.modalAction === this.translate.instant('Grid.edit')
          ? () => this.categoryService.updateCategory(finalValues)
          : () => this.categoryService.createCategory(finalValues)

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
    this.categoryForm.reset()
    this.modalRef = this.modalService.open(content, { size: 'lg' })
  }

  closeModal(): void {
    this.modalRef.close()
  }

  onCustom(event): void {
    const { data } = event

    if (event.action === this.translate.instant('Grid.edit')) {
      this.selectedCategoryId = data.categoryID
      this.openModal(this.content, this.translate.instant('Grid.edit'))

      for (const key in data) {
        if (this.categoryForm.controls[key]) {
          this.categoryForm.controls[key].setValue(data[key])
        }
      }
    }
  }

  ngOnInit() {
    this.loadCategories()
  }

  checkGridDataLoad(): boolean {
    return this.settings.rows.length > 0
  }

  activate(categoryID: number): void {
    this.isRequesting = true

    this.categoryService.activateCategory(categoryID).subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  deactivate(categoryID: number): void {
    this.isRequesting = true

    this.categoryService.deactivateCategory(categoryID).subscribe(
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
    this.selectedCategoryId = row.categoryID
    this.openModal(this.content, this.translate.instant('Grid.edit'))

    for (const key in row) {
      if (this.categoryForm.controls[key]) {
        this.categoryForm.controls[key].setValue(row[key])
      }
    }
  }

  syncGridData(gridModel: GridModel): void {
    this.loadCategories(gridModel, true)
  }

  catRequestBody(gridModel: GridModel, that: any) {
    const { categoryName } = that,
      { currentPageNumber, pageSize } = gridModel

    return {
      pageNumber: currentPageNumber + 1,
      pageSize,
      categoryName: categoryName || ''
    }
  }

  downloadReport(): void {
    this.isRequesting = true
    const gridModel = new GridModel(this.columns, this.settings.totalElements),
      body = this.catRequestBody(gridModel, this)

    this.categoryService.getCategory(body).subscribe(
      data => {
        this.isRequesting = false
        this.convertToExcelService.exportDataGrid(data.categories, 'Categories')
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  loadCategories(
    gridModel: GridModel = this.settings,
    pagination = false
  ): void {
    this.isRequesting = true
    const body = this.catRequestBody(gridModel, this)

    if (!pagination) {
      body.pageNumber = 1
    }

    this.categoryService.getCategory(body).subscribe(
      data => {
        this.isRequesting = false
        const settings = { ...gridModel }
        settings.rows = data.categories
        // settings.columns[4].cellTemplate = this.statusTmpl
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

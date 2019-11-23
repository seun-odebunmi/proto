import {
  Component,
  Injectable,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter
} from '@angular/core'
import { BehaviorSubject } from 'rxjs/Rx'

import { GridModel } from './grid.model'

@Injectable()
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html'
})
export class GridComponent implements OnInit, OnDestroy {
  constructor() {}

  private _gridModelInput = new BehaviorSubject<GridModel>(undefined)
  @Input()
  set gridModelInput(value) {
    value !== undefined
      ? this._gridModelInput.next(value)
      : console.error('Grid Model cannot be empty!')
  }

  get gridModelInput() {
    return this._gridModelInput.getValue()
  }

  @Output()
  onGridSync = new EventEmitter<GridModel>()

  public gridModel = new GridModel()
  public pageSize = this.gridModel.pageSize
  public pageSizeOptions = [5, 10, 15, 20, 30]

  ngOnInit() {
    this._gridModelInput.subscribe(gridModel => {
      this.gridModel = { ...gridModel }
    })
  }

  ngOnDestroy(): void {
    this._gridModelInput.unsubscribe()
  }

  public setPageSize(event) {
    const pageSize: number = parseInt(event.target.value, 10)
    this.gridModel = { ...this.gridModel, pageSize }
    this.onGridSync.emit(this.gridModel)
  }

  public loadPage(pageInfo = { offset: 0 }) {
    this.gridModel.currentPageNumber = pageInfo.offset
    this.onGridSync.emit(this.gridModel)
  }
}

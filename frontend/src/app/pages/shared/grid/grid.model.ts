import { TableColumn } from '@swimlane/ngx-datatable/release/types'

export class Message {
  emptyMessage = 'No data found'
  totalMessage = 'Record(s) Found'
}

export class GridModel {
  pageSize: number
  totalElements: number
  totalPages: number
  currentPageNumber: number
  message: Message
  columns: TableColumn[]
  rows: Array<any>

  constructor(
    defaultColumns: TableColumn[] = new Array(),
    defaultPageSize = 10
  ) {
    this.pageSize = defaultPageSize
    this.totalElements = 0
    this.totalPages = 0
    this.currentPageNumber = 0
    this.message = new Message()
    this.columns = defaultColumns.map<TableColumn>(column => ({
      ...column,
      flexGrow: 1
    }))
    this.rows = new Array()
  }
}

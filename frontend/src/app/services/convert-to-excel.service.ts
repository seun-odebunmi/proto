import { Injectable } from '@angular/core'

import { ApiCallService } from './api-call.service'
import * as XLSX from 'xlsx'

@Injectable()
export class ConvertToExcelService {
  constructor(private apiCall: ApiCallService) {}

  exportDataGrid(res: Array<any>, fileName: string) {
    const ws = XLSX.utils.json_to_sheet(res),
      wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws)
    XLSX.writeFile(wb, `${fileName}.csv`, { bookType: 'csv' })
  }
}

import { Injectable } from '@angular/core'
import * as moment from 'moment'

@Injectable()
export class HelperService {
  constructor() {}

  setDateInput(date): { [key: string]: any } {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    }
  }

  formatDateInput(date: { [key: string]: any }, end?: boolean): string {
    const { year, month, day, ...rest } = date
    const { hour, minute, second } = rest
    const time = hour ? [hour, minute, second] : end ? [23, 59, 59] : [0, 0, 0]

    return date
      ? moment(new Date(year, month - 1, day, ...time)).format(
          'MM/DD/YYYY HH:mm:ss'
        )
      : ''
  }
}

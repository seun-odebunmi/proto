import { Pipe, PipeTransform } from '@angular/core'
import { DatePipe } from '@angular/common'

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  // transform(value: any, args: any[]): any {

  //   if (args && args[0] === 'local') {
  //     return new Date(value).toLocaleString();
  //   }
  //   // else if (value) {
  //   //     return new Date(value);
  //   // }
  //   return value;
  // }
  // transform2(value: any, args: any[]): any {

  //   if (args && args[0] === 'local') {
  //     return new Date(value).toLocaleString();
  //   }
  //   // else if (value) {
  //   //     return new Date(value);
  //   // }

  //   return new Date(value).toISOString().slice(0, 10);
  // }
  transform(value: any, args?: any): any {
    const DATE_FMT = 'dd/MM/yyyy'

    const vaal = value['year'] + '' + value['month'] + '' + value['day']
    const DATE_TIME_FMT = `${DATE_FMT} hh:mm:ss`
    const data = new DatePipe('en-nG').transform(new Date(vaal), DATE_TIME_FMT)
    return data
  }
}

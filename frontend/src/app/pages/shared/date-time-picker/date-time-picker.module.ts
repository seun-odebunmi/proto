import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { DateTimePickerComponent } from './date-time-picker.component'

@NgModule({
  imports: [CommonModule, FormsModule, NgbModule],
  exports: [DateTimePickerComponent],
  declarations: [DateTimePickerComponent],
  providers: []
})
export class DateTimePickerModule {}

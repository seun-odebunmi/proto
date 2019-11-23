import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { MatDialogModule } from '@angular/material'
import { GridModule } from './shared/grid/grid.module'
import { DateTimePickerModule } from './shared/date-time-picker/date-time-picker.module'

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    GridModule,
    DateTimePickerModule,
    NgbModule,
    PerfectScrollbarModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    GridModule,
    DateTimePickerModule,
    NgbModule,
    PerfectScrollbarModule
  ]
})
export class SharedModule {}

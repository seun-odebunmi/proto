import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { TranslateModule } from '@ngx-translate/core'

import { GridComponent } from './grid.component'

@NgModule({
  imports: [CommonModule, NgxDatatableModule, TranslateModule],
  exports: [GridComponent],
  declarations: [GridComponent],
  providers: []
})
export class GridModule {}

import { NgModule } from '@angular/core'
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar'
import { SharedModule } from './shared.module'

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
}

import { routing } from './pages.routing'
import { PagesComponent } from './pages.component'
import { HeaderComponent } from '../theme/components/header/header.component'
import { FooterComponent } from '../theme/components/footer/footer.component'
import { SidebarComponent } from '../theme/components/sidebar/sidebar.component'
import { VerticalMenuComponent } from '../theme/components/menu/vertical-menu/vertical-menu.component'
import { HorizontalMenuComponent } from '../theme/components/menu/horizontal-menu/horizontal-menu.component'
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component'
import { BackTopComponent } from '../theme/components/back-top/back-top.component'
import { UserMenuComponent } from '../theme/components/user-menu/user-menu.component'
import { BlankComponent } from './blank/blank.component'
import { SearchComponent } from './search/search.component'

@NgModule({
  imports: [routing, SharedModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  declarations: [
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    BackTopComponent,
    UserMenuComponent,
    BlankComponent,
    SearchComponent
  ]
})
export class PagesModule {}

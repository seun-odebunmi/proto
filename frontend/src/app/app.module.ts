import { BrowserModule } from '@angular/platform-browser'
import { NgModule, APP_INITIALIZER } from '@angular/core'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HttpModule } from '@angular/http'
import { NgProgressModule } from '@ngx-progressbar/core'
import { NgProgressHttpModule } from '@ngx-progressbar/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr'
import { DateTimePickerModule } from 'ng-pick-datetime'
import { MatDialogModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { routing } from './app.routing'
import { AppSettings } from './app.settings'
import { AppComponent } from './app.component'
import { NotFoundComponent } from './pages/errors/not-found/not-found.component'
import { DialogBoxComponent } from './pages/shared/dialog-box/dialog-box.component'

import { AuthGuard } from './auth.guard'
import { AuthService } from './services/auth.service'
import { ApiCallService } from './services/api-call.service'
import { HelperService } from './services/helper.service'
import { ToastrService } from 'ngx-toastr'
import { LoaderService } from './services/loader.service'
import { ConvertToExcelService } from './services/convert-to-excel.service'
import { DateFormatPipe } from './services/date-format.pipe'
import { DecimalFormat } from './services/pipes'
import { RequestCacheService } from './services/request-cache.service'
import { HttpRequestInterceptor } from './services/http.interceptor'

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http)
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    DateFormatPipe,
    DecimalFormat,
    DialogBoxComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    DateTimePickerModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    FormsModule,
    ReactiveFormsModule,
    NgProgressModule.withConfig({
      spinnerPosition: 'right',
      color: '#DD1B16',
      thick: true
    }),
    NgProgressHttpModule,
    MatDialogModule,
    routing,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AppSettings,
    {
      provide: APP_INITIALIZER,
      useFactory: (appSettings: AppSettings) => () => appSettings.load(),
      deps: [AppSettings],
      multi: true
    },
    RequestCacheService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink, appSettings: AppSettings) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: appSettings.graphqlUrl
          })
        }
      },
      deps: [HttpLink, AppSettings]
    },
    ApiCallService,
    ToastrService,
    AuthGuard,
    AuthService,
    HelperService,
    LoaderService,
    ConvertToExcelService
  ],
  entryComponents: [DialogBoxComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AppSettings } from './app.settings'
import { ISettings } from './app.settings.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  showLoader: boolean
  data: any = {}

  public settings: ISettings
  constructor(
    public appSettings: AppSettings,
    public translate: TranslateService
  ) {
    this.settings = this.appSettings.settings
    this.translate.setDefaultLang('en')
  }

  ngOnInit() {
    const { skinAccentColor } = this.settings.theme,
      langCode = localStorage.getItem('langCode')

    if (skinAccentColor) {
      document.documentElement.style.setProperty(
        '--accent-color',
        skinAccentColor()
      )
    }

    if (langCode) {
      this.translate.use(langCode)
    }
  }
}

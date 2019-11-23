import { Injectable, isDevMode } from '@angular/core'

import { ISettings } from './app.settings.model'

@Injectable()
export class AppSettings {
  public settings: ISettings
  public title = 'whitelabel'
  public baseUrl = 'http://84.200.29.248:4100/mobile-portal/api/'
  public graphqlUrl = `http://${
    isDevMode() ? 'localhost' : '84.200.29.248'
  }:4000/graphql`

  constructor() {}

  public getAccentColor = (): string | null =>
    localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')).user.institution
          .accentColor
      : '#E22628'

  public getLogo = (): string | null =>
    localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')).user.institution.logo
      : ''
  //: 'assets/img/' + this.title + '/logo.png'

  public load() {
    return new Promise((resolve, reject) => {
      try {
        this.settings = {
          title: this.title,
          supportTokenAuthentication: false,
          supportPerTransactionLimit: true,
          name: this.title,
          canGenerateReport: true,
          supportActiveDirectory: false,
          searchRange: 30,
          supportMultipleLanguages: false,
          useTransactionFilters: false,
          canReleaseCustomer: true,
          passwordPolicy: [],
          theme: {
            logoUrl: this.getLogo,
            logoMiniUrl: 'assets/img/default/logo_sm.png',
            skinAccentColor: this.getAccentColor,
            menuOrientation: 'vertical',
            menuType: 'vertical',
            showMenu: true,
            navbarIsFixed: true,
            footerIsFixed: true,
            sidebarIsFixed: true,
            showSideChat: false,
            sideChatIsHoverable: false,
            skinType: this.title,
            mainLogoUrl: 'assets/img/switch.png',
            mainLogoInvUrl: 'assets/img/switch_inv.png'
          }
        }

        resolve(true)
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  }
}

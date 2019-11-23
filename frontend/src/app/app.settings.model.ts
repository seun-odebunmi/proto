interface Theme {
  menuOrientation: string
  menuType: string
  showMenu: boolean
  navbarIsFixed: boolean
  footerIsFixed: boolean
  sidebarIsFixed: boolean
  showSideChat: boolean
  sideChatIsHoverable: boolean
  skinType: string
  skinAccentColor: any
  logoUrl: any
  logoMiniUrl: string
  mainLogoUrl: string
  mainLogoInvUrl: string
}

interface PasswordPolicy {
  regex: string
}

export interface ISettings {
  name: string
  title: string
  canGenerateReport: boolean
  supportActiveDirectory: boolean
  searchRange: number
  supportMultipleLanguages: boolean
  useTransactionFilters: boolean
  canReleaseCustomer: boolean
  supportTokenAuthentication: boolean
  supportPerTransactionLimit: boolean
  passwordPolicy: PasswordPolicy[]
  theme: Theme
}

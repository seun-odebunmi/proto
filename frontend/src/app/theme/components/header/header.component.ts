import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener
} from '@angular/core'
import * as moment from 'moment'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { AppSettings } from '../../../app.settings'
import { ISettings } from '../../../app.settings.model'
import { MenuService } from '../menu/menu.service'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService],
  animations: [
    trigger('showInfo', [
      state('1', style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  public showHorizontalMenu = true
  public showInfoContent = false
  public settings: ISettings
  public menuItems: Array<any>
  public isMenuAvailable = false
  public lastLogin: string

  constructor(
    public appSettings: AppSettings,
    public menuService: MenuService,
    private authService: AuthService
  ) {
    this.settings = this.appSettings.settings
  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.showHorizontalMenu = false
    }
    this.menuItems = this.menuService.getHorizontalMenuItems()
    this.isMenuAvailable = true
    this.lastLogin = moment(
      new Date(this.authService.getCurrentUser().lastLogin)
    ).format('DD/MM/YYYY HH:mm:ss')
  }

  public closeSubMenus() {
    const menu = document.querySelector('#menu0')
    if (menu) {
      for (let i = 0; i < menu.children.length; i++) {
        const child = menu.children[i].children[1]
        if (child) {
          if (child.classList.contains('show')) {
            child.classList.remove('show')
            menu.children[i].children[0].classList.add('collapsed')
          }
        }
      }
    }
  }

  logout() {
    this.authService.logout()
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.showHorizontalMenu = false
    } else {
      this.showHorizontalMenu = true
    }
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { AppSettings } from '../../../app.settings'
import { ISettings } from '../../../app.settings.model'
import { Menu } from '../menu/menu.model'
import { MenuService } from '../menu/menu.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class SidebarComponent implements OnInit {
  public settings: ISettings
  public menuItems: Array<Menu>
  public isMenuAvailable = false

  constructor(
    public appSettings: AppSettings,
    public menuService: MenuService
  ) {
    this.settings = this.appSettings.settings
  }

  ngOnInit() {
    this.menuItems = this.menuService.getVerticalMenuItems()
    this.isMenuAvailable = true
  }

  public closeSubMenus() {
    const menu = document.querySelector('#menu0')
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

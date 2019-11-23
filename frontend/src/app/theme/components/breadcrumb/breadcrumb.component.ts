import { Component, ViewEncapsulation } from '@angular/core'
import {
  ActivatedRoute,
  Router,
  ActivatedRouteSnapshot,
  UrlSegment,
  NavigationEnd
} from '@angular/router'
import { Title } from '@angular/platform-browser'
import { AppSettings } from '../../../app.settings'
import { ISettings } from '../../../app.settings.model'
import { Menu } from '../menu/menu.model'
import { MenuService } from '../menu/menu.service'

@Component({
  selector: 'app-breadcrumb',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './breadcrumb.component.html',
  providers: [MenuService]
})
export class BreadcrumbComponent {
  public settings: ISettings
  public pageTitle: string
  public menuItems: Array<Menu>
  public breadcrumbs: {
    name: string
    url: string
  }[] = []

  constructor(
    public appSettings: AppSettings,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public title: Title,
    public menuService: MenuService
  ) {
    this.settings = this.appSettings.settings
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = []
        this.menuItems = this.menuService.getVerticalMenuItems()
        this.parseRoute(this.router.routerState.snapshot.root)
        this.pageTitle = ''
        this.breadcrumbs.forEach(breadcrumb => {
          this.pageTitle += ' > ' + breadcrumb.name
        })
        this.title.setTitle(this.settings.name + this.pageTitle)
      }
    })
  }

  parseRoute(node: ActivatedRouteSnapshot) {
    if (node.data['breadcrumb']) {
      if (node.url.length && this.menuItems.length) {
        let urlSegments: UrlSegment[] = []
        node.pathFromRoot.forEach(routerState => {
          urlSegments = urlSegments.concat(routerState.url)
        })
        const url = urlSegments
          .map(urlSegment => {
            return urlSegment.path
          })
          .join('/')
        const menuItem = this.menuItems.find(
          item =>
            !!item.routerLink &&
            item.routerLink.toLowerCase().indexOf(url.toLowerCase()) > -1
        )
        this.breadcrumbs.push({
          name: menuItem ? menuItem.title : node.data['breadcrumb'],
          url: '/' + url
        })
      }
    }
    if (node.firstChild) {
      this.parseRoute(node.firstChild)
    }
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
}

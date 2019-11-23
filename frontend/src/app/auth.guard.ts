import { Injectable, OnInit } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'
import { AuthService } from './services/auth.service'

@Injectable()
export class AuthGuard implements CanActivate, OnInit {
  constructor(
    private toastrService: ToastrService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const {
      authService: {
        decodeToken,
        logout,
        isFirstLogin,
        isAuthenticated,
        getCurrentUserMenu
      }
    } = this

    const {
      routeConfig: { data: currData, path: currPath }
    } = route

    if (isAuthenticated()) {
      const menuFound = getCurrentUserMenu().find(
          ({ routerLink }) => routerLink && routerLink.indexOf(currPath) > -1
        ),
        expiryDate = new Date(decodeToken().ED),
        now = new Date()

      if (now >= expiryDate) {
        this.toastrService.error(
          this.translate.instant('Labels.sessionExpired')
        )
        logout()
      } else {
        if (isFirstLogin()) {
          if (currPath !== 'change-password') {
            this.router.navigate(['/change-password'])
          }
          return true
        } else {
          if (menuFound) {
            return true
          } else if (
            (currPath === 'change-password' ||
              currPath === 'profile' ||
              currPath === 'appVersion') &&
            currData
          ) {
            return true
          } else {
            // this.toastrService.error(this.translate.instant('Labels.noRoute'))
            this.router.navigate(['/pages/profile'])
          }
        }
      }
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      })
      return false
    }
  }
}

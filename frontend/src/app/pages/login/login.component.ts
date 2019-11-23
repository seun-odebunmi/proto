import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit
} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder
} from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { LoaderService } from '../../services/loader.service'
import { AppSettings } from '../../app.settings'
import { ISettings } from '../../app.settings.model'
import { TranslateService } from '@ngx-translate/core'
import { trimSpacesValidate } from '../../validators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})
export class LoginComponent implements OnInit, AfterViewInit {
  public form: FormGroup
  public email: AbstractControl
  public password: AbstractControl
  public authToken: AbstractControl
  public settings: ISettings

  languages = Array<any>()
  returnUrl: string

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public appSettings: AppSettings,
    public loaderService: LoaderService,
    public translate: TranslateService,
    fb: FormBuilder
  ) {
    this.settings = this.appSettings.settings
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
    this.form = fb.group({
      email: ['', [trimSpacesValidate]],
      password: ['', [trimSpacesValidate]]
    })
    if (this.settings.supportTokenAuthentication) {
      this.form.addControl(
        'authToken',
        new FormControl('', [trimSpacesValidate])
      )
    }
    Object.keys(this.form.controls).map(key => {
      this[key] = this.form.controls[key]
    })
  }

  public onSubmit(values): void {
    if (this.form.valid) {
      this.authService.login(values).subscribe(response => {
        const user = {
          ...response,
          firstLogin: response.user.firstLogin,
          lastLogin: new Date().getTime()
        }
        console.log('loggedInUser', user)

        if (user && user.token) {
          const { skinAccentColor } = this.settings.theme
          localStorage.setItem('currentUser', JSON.stringify(user))

          if (skinAccentColor) {
            document.documentElement.style.setProperty(
              '--accent-color',
              skinAccentColor()
            )
          }

          if (!user.firstLogin) {
            this.router.navigateByUrl(this.returnUrl)
          } else {
            this.router.navigateByUrl('/change-password')
          }
        }
      })
    }
  }

  public useLanguage(language: string) {
    localStorage.setItem('langCode', language)
    this.translate.use(language)
  }

  public loadLangs() {
    this.languages = ['en', 'fr']
    this.translate.addLangs(this.languages)
  }

  ngOnInit() {
    this.loadLangs()
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl)
    }
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide')
  }
}

import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit
} from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { LoaderService } from '../../services/loader.service'
import { AppSettings } from '../../app.settings'
import { ISettings } from '../../app.settings.model'
import { trimSpacesValidate } from '../../validators'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  public form: FormGroup
  public email: AbstractControl
  public settings: ISettings

  constructor(
    private authService: AuthService,
    private router: Router,
    public loaderService: LoaderService,
    public appSettings: AppSettings,
    fb: FormBuilder
  ) {
    this.settings = this.appSettings.settings
    this.form = fb.group({
      email: ['', [trimSpacesValidate]]
    })
    Object.keys(this.form.controls).map(key => {
      this[key] = this.form.controls[key]
    })
  }

  public onSubmit(values): void {
    if (this.form.valid) {
      this.authService.resetPassword(values).subscribe()
    }
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/pages/dashboard'])
    }
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide')
  }
}

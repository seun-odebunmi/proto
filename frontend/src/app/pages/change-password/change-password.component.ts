import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms'

import {
  confirmFields,
  trimSpacesValidate,
  passwordPolicyVal
} from '../../validators'
import { AuthService } from '../../services/auth.service'
import { LoaderService } from '../../services/loader.service'
import { ChangePasswordService } from './change-password.services'
import { AppSettings } from '../../app.settings'
import { ISettings } from '../../app.settings.model'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})
export class ChangePasswordComponent implements OnInit {
  public form: FormGroup
  public oldPassword: AbstractControl
  public newPassword: AbstractControl
  public confirmPassword: AbstractControl
  public settings: ISettings

  firstLogin: boolean = this.authService.isFirstLogin()

  constructor(
    private authService: AuthService,
    private changePasswordService: ChangePasswordService,
    public loaderService: LoaderService,
    public appSettings: AppSettings,
    fb: FormBuilder
  ) {
    this.settings = this.appSettings.settings
    this.form = fb.group(
      {
        oldPassword: ['', [trimSpacesValidate]],
        newPassword: [
          '',
          Validators.compose([
            trimSpacesValidate,
            controls =>
              passwordPolicyVal(
                controls,
                (this.settings.passwordPolicy &&
                  this.settings.passwordPolicy[0]) ||
                  null
              )
          ])
        ],
        confirmPassword: ['', [trimSpacesValidate]]
      },
      {
        validator: group =>
          confirmFields(
            group,
            'newPassword',
            'confirmPassword',
            'Passwords do not match'
          )
      }
    )
    Object.keys(this.form.controls).map(key => {
      this[key] = this.form.controls[key]
    })
  }

  public onSubmit(values: any): void {
    if (this.form.valid) {
      const body = { ...values }

      this.changePasswordService
        .changePassword(body)
        .subscribe(response => this.authService.logout())
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide')
  }
}

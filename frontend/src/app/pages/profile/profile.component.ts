import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  OnInit
} from '@angular/core'

import { AuthService } from '../../services/auth.service'
import { ProfileService } from './profile.services'
import { AppSettings } from '../../app.settings'
import { ISettings } from '../../app.settings.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})
export class ProfileComponent implements AfterViewInit, OnInit {
  public settings: ISettings
  public tokenData: any

  isRequesting = false
  profileInfo: any

  constructor(
    private profileService: ProfileService,
    public appSettings: AppSettings,
    private authService: AuthService
  ) {
    this.tokenData = this.authService.decodeToken()
    this.settings = this.appSettings.settings
  }

  public getProfile(): void {
    this.isRequesting = true
    const { user } = this.tokenData
    const body = { id: user.id }

    this.profileService.getProfile(body).subscribe(
      response => {
        this.isRequesting = false
        const {
          emailAddress,
          firstName,
          lastName,
          mobileNumber,
          username,
          role: { name: roleName },
          branch: { name: branchName },
          institution: { name: institutionName }
        } = response
        this.profileInfo = {
          emailAddress,
          firstName,
          lastName,
          mobileNumber,
          username,
          role: roleName,
          branch: branchName,
          institution: institutionName
        }
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  ngOnInit() {
    this.getProfile()
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide')
  }
}

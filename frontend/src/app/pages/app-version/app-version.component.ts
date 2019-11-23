import { Component, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core'

import { AuthService } from '../../services/auth.service'
import { ToastrService } from 'ngx-toastr'
import { AppVersionService } from './app-version.services'
import { AppSettings } from '../../app.settings'
import { ISettings } from '../../app.settings.model'

@Component({
  selector: 'app-profile',
  templateUrl: './app-version.component.html',
  styleUrls: ['./app-version.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})
export class AppVersionComponent implements AfterViewInit, OnInit {
  public settings: ISettings

  isRequesting = false
  versionNumber: string

  constructor(
    private appVersionService: AppVersionService,
    private toastrService: ToastrService,
    public appSettings: AppSettings
  ) {
    this.settings = this.appSettings.settings
  }

  public getVersionNumber(): void {
    this.isRequesting = true

    this.appVersionService.getVersionNumber().subscribe(
      response => {
        this.isRequesting = false
        this.versionNumber = response.version
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  public increaseVersionNumber(): void {
    this.isRequesting = true

    this.appVersionService.increaseVersionNumber().subscribe(
      response => {
        this.isRequesting = false
        this.toastrService.success(response.description)
        this.getVersionNumber()
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  ngOnInit() {
    this.getVersionNumber()
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide')
  }
}

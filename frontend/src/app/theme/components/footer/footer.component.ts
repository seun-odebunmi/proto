import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { AppSettings } from '../../../app.settings'
import { ISettings } from '../../../app.settings.model'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  public settings: ISettings
  public copyright: string =
    'Copyright © ' + new Date().getFullYear() + ' All Rights Reserved'

  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings
  }

  ngOnInit() {}
}

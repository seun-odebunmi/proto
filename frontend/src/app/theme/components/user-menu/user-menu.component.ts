import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {
  user: string
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const { firstName, lastName, institution } = this.authService.getAuthUser()
    this.user = `${firstName} ${lastName} (${institution.name})`
  }
}

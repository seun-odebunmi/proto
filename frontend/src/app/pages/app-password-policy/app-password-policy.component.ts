import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { AppPasswordPolicyService } from './app-password-policy.services'
import { ToastrService } from 'ngx-toastr'

import { IPolicies } from './app-password-policy.model'

@Component({
  selector: 'app-role',
  templateUrl: './app-password-policy.component.html',
  styleUrls: ['./app-password-policy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppPasswordPolicyComponent implements OnInit {
  isRequesting = false
  policies: IPolicies[]

  constructor(
    private appPasswordPolicyService: AppPasswordPolicyService,
    private toastrService: ToastrService
  ) {}

  public onSubmit(): void {
    this.isRequesting = true

    const policies = this.policies
      .filter(policy => policy.app === true)
      .map(policy => policy.id)

    this.appPasswordPolicyService.savePasswordPolicy(policies).subscribe(
      response => {
        this.toastrService.success(response.description)
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }

  ngOnInit() {
    this.loadPasswordPolicy()
  }

  onCheckChange(event): void {
    const element = event.target as HTMLInputElement
    const id: number = parseInt(element.dataset.id, 10),
      checkValue = element.checked

    this.policies = this.policies.map(policy =>
      policy.id === id
        ? { ...policy, app: checkValue }
        : { ...policy, app: false }
    )
  }

  loadPasswordPolicy(): void {
    this.isRequesting = true

    this.appPasswordPolicyService.getPasswordPolicy().subscribe(
      response => {
        this.policies = response.policies
        this.isRequesting = false
      },
      error => {
        this.isRequesting = false
      }
    )
  }
}

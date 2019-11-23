import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { PortalPasswordPolicyService } from './portal-password-policy.services'
import { ToastrService } from 'ngx-toastr'

import { IPolicies } from './portal-password-policy.model'

@Component({
  selector: 'app-role',
  templateUrl: './portal-password-policy.component.html',
  styleUrls: ['./portal-password-policy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortalPasswordPolicyComponent implements OnInit {
  isRequesting = false
  policies: IPolicies[]

  constructor(
    private portalPasswordPolicyService: PortalPasswordPolicyService,
    private toastrService: ToastrService
  ) {}

  public onSubmit(): void {
    this.isRequesting = true

    const policies: number[] = this.policies
      .filter(policy => policy.portal === true)
      .map(policy => policy.id)

    this.portalPasswordPolicyService.savePasswordPolicy(policies).subscribe(
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
        ? { ...policy, portal: checkValue }
        : { ...policy, portal: false }
    )
  }

  loadPasswordPolicy(): void {
    this.isRequesting = true

    this.portalPasswordPolicyService.getPasswordPolicy().subscribe(
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

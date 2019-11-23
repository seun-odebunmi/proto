import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms'
import { CustomerService } from '../customers/customers.services'
import { PinResetService } from './pin-reset.services'
import { ToastrService } from 'ngx-toastr'
import { trimSpacesValidate } from '../../validators'

@Component({
  selector: 'app-pin-reset',
  templateUrl: './pin-reset.component.html',
  styleUrls: ['./pin-reset.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PinResetComponent implements OnInit {
  public searchForm: FormGroup
  public customerIDSearch: AbstractControl
  public resetForm: FormGroup
  public customerName: AbstractControl
  public username: AbstractControl
  public primaryAccountNumber: AbstractControl

  isLoaded = false
  isRequesting = false

  constructor(
    fb: FormBuilder,
    private customerService: CustomerService,
    private pinResetService: PinResetService,
    private toastrService: ToastrService
  ) {
    this.searchForm = fb.group({
      customerIDSearch: ['', [trimSpacesValidate]]
    })
    Object.keys(this.searchForm.controls).map(key => {
      this[key] = this.searchForm.controls[key]
    })
    this.resetForm = fb.group({
      customerName: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }],
      primaryAccountNumber: [{ value: '', disabled: true }]
    })
    Object.keys(this.resetForm.controls).map(key => {
      this[key] = this.resetForm.controls[key]
    })
  }

  ngOnInit() {}

  loadCustomer() {
    if (this.searchForm.valid) {
      const body = {
        accountNumber: this.customerIDSearch.value,
        pageNumber: 1,
        pageSize: 10
      }
      this.isRequesting = true

      this.customerService.searchCustomer(body).subscribe(
        data => {
          this.isRequesting = false
          this.isLoaded = true

          Object.keys(this.resetForm.controls).map(key => {
            data.customer && data.customer[key]
              ? this.resetForm.get(key).setValue(data.customer[key])
              : this.resetForm.get(key).setValue('')
          })
        },
        error => {
          this.isRequesting = false
          this.isLoaded = false
          this.resetForm.reset('')
        }
      )
    }
  }

  onReset() {
    const body = {
      accountNumber: this.customerIDSearch.value
    }
    this.isRequesting = true

    this.pinResetService.resetPin(body).subscribe(
      data => {
        this.isRequesting = false
        this.toastrService.success(data.description)
      },
      error => {
        this.isRequesting = false
      }
    )
  }
}

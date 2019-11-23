import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
  OnInit,
  forwardRef
} from '@angular/core'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

const now = new Date()

@Injectable()
@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DateTimePickerComponent)
    }
  ]
})
export class DateTimePickerComponent implements OnInit, ControlValueAccessor {
  public dpModel

  @Output()
  dateChange: EventEmitter<NgbDateStruct> = new EventEmitter<NgbDateStruct>()

  private _dpModelInput
  @Input()
  get dpModelInput(): NgbDateStruct {
    return this._dpModelInput
  }

  set dpModelInput(val: NgbDateStruct) {
    this._dpModelInput = val
  }

  protected onChange(newDate: NgbDateStruct): void {}
  protected onTouched(): void {}

  public writeValue(date: NgbDateStruct): void {
    this.dpModel = date
  }

  public registerOnChange(fn: (date: NgbDateStruct) => void): void {
    this.onChange = fn
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  public updateDate(): void {
    this.dateChange.emit(this.dpModel)
  }

  ngOnInit() {}

  public maxDate(): NgbDateStruct {
    const today = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    }

    return today
  }

  public isDisabled = (d: NgbDateStruct): boolean => {
    const today = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      ),
      date = new Date(d.year, d.month, d.day)

    return date > today
  }
}

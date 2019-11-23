import { AbstractControl, FormGroup, FormControl } from '@angular/forms'
import * as moment from 'moment'

const regExp = /^(?! )[\W\S]*[^ ]$/
const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

export const emailValidator = (
  control: FormControl
): { [key: string]: any } => {
  if (control.value && !emailRegexp.test(control.value)) {
    return { invalidEmail: true }
  }
}

export const atLeastOneValidator = (ctrlArr?: any) => {
  return (
    group
  ): {
    [key: string]: any
  } => {
    const controls = group.controls

    if (controls) {
      let theOne = null
      if (ctrlArr && ctrlArr.length > 0) {
        theOne = ctrlArr.find(item => controls[item].value !== '')
      } else {
        theOne = Object.keys(controls).find(key => controls[key].value !== '')
      }

      if (!theOne) {
        return {
          atLeastOneRequired: {
            text: 'At least one should be selected'
          }
        }
      }
    }
    return null
  }
}

export const matchingPasswords = (
  control: AbstractControl,
  pwdKey: string,
  msg?: string
): { [key: string]: any | null } => {
  const { value, parent } = control
  const password = parent ? parent.controls[pwdKey].value : ''
  const text = msg || 'Passwords do not match'

  if (value != password) {
    return { mismatchedPasswords: true, text }
  }

  return null
}

export const confirmFields = (
  group: FormGroup,
  field1: string,
  field2: string,
  msg?: string
): { [key: string]: any | null } => {
  const text = msg || 'Passwords do not match'

  if (group.value[field1] !== group.value[field2]) {
    return { mismatchedFields: true, text, [field2]: { required: true } }
  }

  return null
}

export const dateLessThan = (startDate: string, endDate: string) => {
  return (c): { [key: string]: any } | null => {
    const validatorField = {
        [startDate]: { text: 'Start Date should be earlier than End Date' }
      },
      sDate =
        (c.get(startDate).value &&
          moment(
            new Date(
              c.get(startDate).value.year,
              c.get(startDate).value.month - 1,
              c.get(startDate).value.day
            )
          )) ||
        null
    const eDate =
      (c.get(endDate).value &&
        moment(
          new Date(
            c.get(endDate).value.year,
            c.get(endDate).value.month - 1,
            c.get(endDate).value.day
          )
        )) ||
      null

    if (sDate !== null && eDate !== null && sDate > eDate) {
      return validatorField
    }
    return null
  }
}

export const trimSpaces = (
  control: AbstractControl
): { [key: string]: boolean } | null => {
  if (!regExp.test(control.value)) {
    return {
      notTrimmed: true
    }
  }
  return null
}

export const trimSpacesValidate = (
  control: AbstractControl
): { [key: string]: boolean } | null => {
  if (
    control.value === null ||
    control.value === '' ||
    !regExp.test(control.value)
  ) {
    return {
      required: true
    }
  }
  return null
}

export const passwordPolicyVal = (
  control: AbstractControl,
  pwdPolicy: { [key: string]: any }
): { [key: string]: any | null } => {
  const { value } = control
  let { regex, message: text } = pwdPolicy || { regex: null, message: null }

  try {
    if (!regex || regex === null || regex === '') {
      throw new Error()
    } else {
      regex = new RegExp(regex)
    }
  } catch (err) {
    regex = regExp
    text = null
  }

  if (!regex.test(value)) {
    return { text, required: true }
  }
  return null
}

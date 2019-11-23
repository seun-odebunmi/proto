import { DecimalPipe } from '@angular/common'

export class DecimalFormat extends DecimalPipe {
  public transform(value): any {
    return super.transform(value)
  }
}

export class CardMask {
  public transform(value): string {
    const formatted = `${value.slice(0, 4)}********${value.slice(-4)}`
    return formatted
  }
}

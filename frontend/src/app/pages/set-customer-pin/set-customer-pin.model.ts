import { Observable } from 'rxjs/Observable'

interface Cards {
  cardNumber: string
  status: string
  currency: string
  expiryDate: string
  cardLimit: number
  memNo: number
  validFrom: string
  cardHolderName: string
  cardCategory: string
  cardType: string
  authorisedSign: string
  cardTypeCode: string
}

interface GetCustomerCardsBody {
  pageNumber: number
  pageSize: number
  userLoginID: string
}

interface GetCustomerCardsResponse {
  code: number
  description: string
  cards: Cards[]
  totalRecordCount: number
}

export interface IGetCustomerCards {
  (body: GetCustomerCardsBody): Observable<GetCustomerCardsResponse>
}

interface SetCustomerPinBody {
  customerusername: string
  cardNumber: string
  expiryDate: string
}

export interface ISetCustomerPin {
  (body: SetCustomerPinBody): Observable<any>
}

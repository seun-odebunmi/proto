import { Injectable } from '@angular/core'

import { ApiCallService } from '../../services/api-call.service'
import { AppSettings } from '../../app.settings'
import { IGetTransactions } from './transactions.model'

@Injectable()
export class TransactionService {
  constructor(private apiCall: ApiCallService, private settings: AppSettings) {}

  useTransactionFilters() {
    return this.settings.settings.useTransactionFilters
  }

  getTransactionTypes() {
    return this.apiCall.get('transactions/transactionTypes')
  }

  getFilterParams() {
    return this.apiCall.get('portal/transaction/filterParams')
  }

  getTransactions(body: IGetTransactions) {
    return this.apiCall.post('transactions/search', body)
  }
}

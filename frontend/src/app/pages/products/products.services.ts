import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateProduct,
  ICreateProduct,
  IGetProducts,
  IGetProductsReturn
} from './products.model'

@Injectable()
export class ProductService {
  constructor(private apiCall: ApiCallService) {}

  getProducts(body: IGetProducts): Observable<IGetProductsReturn> {
    return this.apiCall.post('portal/system/products/search', body)
  }

  createProduct(user: ICreateProduct[]) {
    return this.apiCall.post(
      'portal/system/product/create/initiate',
      user,
      'application/json'
    )
  }

  updateProduct(user: IUpdateProduct[]) {
    return this.apiCall.put(
      'portal/system/product/edit/initiate',
      user,
      'application/json'
    )
  }

  activateProduct(productId: number) {
    return this.apiCall.post(
      'portal/system/product/' + productId + '/enable/initiate',
      null
    )
  }

  deactivateProduct(productId: number) {
    return this.apiCall.post(
      'portal/system/product/' + productId + '/disable/initiate',
      null
    )
  }
}

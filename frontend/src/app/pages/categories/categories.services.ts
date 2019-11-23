import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { ApiCallService } from '../../services/api-call.service'
import {
  IUpdateCategory,
  ICreateCategory,
  IGetCategories,
  IGetCategoriesReturn
} from './categories.model'

@Injectable()
export class CategoryService {
  constructor(private apiCall: ApiCallService) {}

  getCategory(body: IGetCategories): Observable<IGetCategoriesReturn> {
    return this.apiCall.post('portal/system/categories/search', body)
  }

  createCategory(category: ICreateCategory[]) {
    return this.apiCall.post(
      'portal/system/category/create/initiate',
      category,
      'application/json'
    )
  }

  updateCategory(category: IUpdateCategory[]) {
    return this.apiCall.put(
      'portal/system/category/edit/initiate',
      category,
      'application/json'
    )
  }

  activateCategory(categoryID: number) {
    return this.apiCall.post(
      'portal/system/category/' + categoryID + '/enable/initiate',
      null
    )
  }

  deactivateCategory(categoryID: number) {
    return this.apiCall.post(
      'portal/system/category/' + categoryID + '/disable/initiate',
      null
    )
  }
}

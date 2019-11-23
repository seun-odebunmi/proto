import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { throwError } from 'rxjs'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'

import { Apollo } from 'apollo-angular'

import { AppSettings } from '../app.settings'
import { AESEncryptionUtil } from '../AESEncryption.js'
import { ToastrService } from 'ngx-toastr'

@Injectable()
export class ApiCallService {
  public baseUrl: string = this.appSettings.baseUrl

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private toastrService: ToastrService,
    private appSettings: AppSettings
  ) {}

  formParams(obj) {
    let dataStr = ''
    const newObj = { ...obj }
    Object.keys(newObj).forEach(key => {
      if (newObj[key] === '' || newObj[key] === null) {
        delete newObj[key]
      }
    })

    for (const key in newObj) {
      if (newObj.hasOwnProperty(key)) {
        dataStr +=
          dataStr === '' ? `${key}=${newObj[key]}` : `&${key}=${newObj[key]}`
      }
    }

    return dataStr
  }

  public get(path: string, getBody?: any): Observable<any> {
    const actionUrl = this.baseUrl + path,
      headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    let params = null

    if (getBody) {
      params = AESEncryptionUtil.encryptText(
        JSON.stringify(this.formParams(getBody))
      )
    }

    return this.http
      .get(actionUrl, {
        observe: 'response',
        headers,
        params
      })
      .map(response => this.extractData(response, 'get'))
      .catch(error => this.handleError(error))
  }

  public post(path: string, postBody: any, contentType?: any): Observable<any> {
    const actionUrl = this.baseUrl + path,
      headers = contentType
        ? new HttpHeaders({ 'Content-Type': contentType })
        : new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
      body = contentType ? JSON.stringify(postBody) : this.formParams(postBody),
      encryptedData = JSON.stringify(AESEncryptionUtil.encryptText(body))
    // console.log(body)

    return this.http
      .post(actionUrl, body, {
        observe: 'response',
        // responseType: 'text',
        headers
      })
      .map(response => this.extractData(response, 'post'))
      .catch(error => this.handleError(error))
  }

  public put(path: string, putBody: any, contentType?: any): Observable<any> {
    const actionUrl = this.baseUrl + path,
      headers = contentType
        ? new HttpHeaders({ 'Content-Type': contentType })
        : new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
      body = contentType ? JSON.stringify(putBody) : this.formParams(putBody),
      encryptedData = JSON.stringify(AESEncryptionUtil.encryptText(body))
    // console.log(body)

    return this.http
      .put(actionUrl, body, {
        observe: 'response',
        // responseType: 'text',
        headers
      })
      .map(response => this.extractData(response, 'put'))
      .catch(error => this.handleError(error))
  }

  public delete(path: string, getBody?: any): Observable<any> {
    const actionUrl = this.baseUrl + path,
      headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    let params = null

    if (getBody) {
      params = AESEncryptionUtil.encryptText(
        JSON.stringify(this.formParams(getBody))
      )
    }

    return this.http
      .delete(actionUrl, {
        observe: 'response',
        // responseType: 'text',
        headers,
        params
      })
      .map(response => this.extractData(response, 'delete'))
      .catch(error => this.handleError(error))
  }

  public query(query: any, body?: any): Observable<any> {
    console.log('body', body)

    return this.apollo
      .query({
        query,
        ...(body && { variables: { input: body } }),
        fetchPolicy: 'network-only'
      })
      .map(response => this.extractData(response, 'query'))
      .catch(error => this.handleError(error))
  }

  public mutate(query: any, body: any): Observable<any> {
    console.log('body', body)

    return this.apollo
      .mutate({
        mutation: query,
        variables: { input: body }
      })
      .map(response => this.extractData(response, 'mutate'))
      .catch(error => this.handleError(error))
  }

  private errorCodeHandler = (message: string, code?: string): any => {
    this.toastrService.error(message)

    if (code === 'UNAUTHENTICATED' || code === 'FORBIDDEN') {
      // session expired
      setTimeout(() => {
        localStorage.removeItem('currentUser')
        window.location.reload(true)
      }, 1000)
    }

    return null
  }

  public extractData(res: any, method: string) {
    console.log('res', res)

    if (res.data) {
      Object.keys(res.data).map(key => {
        const obj = res.data[key]

        if (obj['__typename'] === 'MutationResponse') {
          if (obj.success) {
            this.toastrService.success(obj.description)
          } else {
            this.toastrService.error(obj.description)
          }
        }
      })

      return res.data
    } else {
      if (res.status < 200 || res.status >= 300) {
        throw new Error('This request has failed ' + res.status)
      } else {
        // const response =
        //   method !== 'get'
        //     ? JSON.parse(AESEncryptionUtil.decryptText(res.body))
        //     : res.body
        const response = res.body // JSON.parse(res.body)

        if (response.code === 0) {
          console.log('res', response)
          if (method !== 'get' && response.description) {
            this.toastrService.success(response.description)
          }

          return response || {}
        } else {
          if (response.code === 30) {
            // session expired
            setTimeout(() => {
              localStorage.removeItem('currentUser')
              window.location.reload(true)
            }, 1000)
          }
          throw new Error(response.description)
        }
      }
    }
  }

  private handleError(error: any): any {
    console.dir(error)
    const { graphQLErrors, networkError } = error

    if (!graphQLErrors) {
      if (error instanceof ErrorEvent) {
        const { message } = error.error
        this.errorCodeHandler(message)
      } else if (error instanceof HttpErrorResponse) {
        const { message } = error
        this.errorCodeHandler(message)
      } else {
        this.errorCodeHandler(error)
      }
    }

    if (Array.isArray(graphQLErrors)) {
      graphQLErrors.forEach(({ extensions: { code }, message }) =>
        this.errorCodeHandler(message, code)
      )
    }

    if (networkError instanceof HttpErrorResponse) {
      if (Array.isArray(networkError.error.errors)) {
        networkError.error.errors.forEach(({ extensions: { code }, message }) =>
          this.errorCodeHandler(message, code)
        )
      }
    }

    return throwError(error)
  }
}

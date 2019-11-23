import { Injectable } from '@angular/core'
import {
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http'
import { Observable } from 'rxjs/Rx'

import { RequestCacheService } from './request-cache.service'
import { LoaderService } from './loader.service'
import { AuthService } from './auth.service'

const TTL = 10 // seconds

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = []

  constructor(
    private cache: RequestCacheService,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req)
    this.requests.splice(i, 1)
    this.loaderService.isLoading.next(this.requests.length > 0)
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // const cachedResponse = this.cache.get(req.url)
    const requestObj: any = {
      deviceId: localStorage.getItem('deviceID') || 1,
      appVersion: '1.2',
      languageCode: localStorage.getItem('langCode') || 1,
      countryCode: '1',
      ...(this.authService.isAuthenticated() && {
        sessionID: this.authService.getCurrentUserToken()
      })
    }

    req = req.clone({
      setHeaders: requestObj
    })

    // cache only GET methods
    // if (req.method !== 'GET') {
    //   return next.handle(req)
    // }

    // return cachedResponse
    //   ? Observable.of(cachedResponse)
    //   : this.sendRequest(req, next)
    this.requests.push(req)
    this.loaderService.isLoading.next(true)
    return Observable.create(observer => {
      const subscription = next.handle(req).subscribe(
        event => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req)
            observer.next(event)
          }
        },
        err => {
          this.removeRequest(req)
          observer.error(err)
        },
        () => {
          this.removeRequest(req)
          observer.complete()
        }
      )
      // teardown logic in case of cancelled requests
      return () => {
        this.removeRequest(req)
        subscription.unsubscribe()
      }
    })
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).do(event => {
      if (event instanceof HttpResponse) {
        this.cache.set(req.url, event, TTL)
      }
    })
  }
}

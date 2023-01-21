import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { StoreService } from '../store/store.service';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private userService: UserService) {}

  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string| null>(null);


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(request)).pipe(
      catchError((requestError: HttpErrorResponse) => {
        if (requestError && requestError.status === 401) {
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter((result) => !!result),
              take(1),
              switchMap(() => next.handle(this.addAuthToken(request)))
            );
          } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            return this.userService.refreshAuthToken().pipe(
              switchMap((token) => {
                this.refreshTokenSubject.next(token);
                return next.handle(this.addAuthToken(request));
              }),
              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        } else {
          return throwError(() => requestError);
        }
      })
    );
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = localStorage.getItem(StoreService.tokenName);

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

}

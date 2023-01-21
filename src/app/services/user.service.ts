import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { DishOrder, HistoryOrder, LoginData, User, UserData } from '../store/datatypes';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  api = 'http://localhost:3000/api';


  registerUser(user: LoginData): Observable<boolean> {
    return this.http
      .post<HttpResponse<any>>(`${this.api}/register`, user, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => res.status == 200),
        catchError(() => of(false))
      );
  }

  loginUser(user: LoginData): Observable<HttpResponse<{ token: string, refreshToken:string }>> {
    return this.http
      .post<{ token: string, refreshToken:string }>(`${this.api}/login`, user, {
        observe: 'response',
      });
  }

  updateOrder(order: DishOrder[]): Observable<HttpResponse<DishOrder[]>> {
    return this.http
      .put<DishOrder[]>(`${this.api}/user/order`, order,{
        observe: 'response',
      });
  }

  getUserData(): Observable<HttpResponse<UserData>> {
    return this.http
      .get<UserData>(`${this.api}/user`, {
        observe: 'response',
      });
  }

  getUserRoles(): Observable<HttpResponse<string[]>> {
    return this.http
      .get<string[]>(`${this.api}/user/roles`, {
        observe: 'response',
      })
  }

  addOrderToHistory(order: HistoryOrder): Observable<HttpResponse<HistoryOrder[]>> {
    return this.http
    .post<HistoryOrder[]>(`${this.api}/user/history`, order, {
      observe: 'response',
    })
  }

  getAllUsers(): Observable<HttpResponse<User[]>> {
    return this.http
      .get<User[]>(`${this.api}/admin/users`, {
        observe: 'response',
      })
  }

  putUsers(users: User[]): Observable<HttpResponse<User[]>> {
    return this.http
      .put<User[]>(`${this.api}/admin/users`, users, {
        observe: 'response',
      })
  }

  checkToken(): Observable<HttpResponse<boolean>> {
    return this.http
    .get<boolean>(`${this.api}/checkToken`, {
      observe: 'response',
    });
  } 

  refreshAuthToken(): Observable<string> {
    return this.http
    .put<{token: string}>(`${this.api}/refreshToken`, { refreshToken: this.getRefreshToken() }).pipe(map(data => {
      localStorage.setItem(StoreService.tokenName, data.token);
      return data.token;
    }));
  }

  getRefreshToken() {
    return localStorage.getItem(StoreService.refreshTokenName) ?? "";
  }
}
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Dish } from '../store/datatypes';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient) {}

  api = 'http://localhost:3000/api';

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.api}/dishes`);
  }

  postDish(dish: Dish): Observable<Dish> {
    return this.http.post<Dish>(`${this.api}/dish`, dish);
  }

  patchDish(id: number, dishChange: Partial<Dish>): Observable<Dish> {
    return this.http.patch<Dish>(`${this.api}/dish/${id}`, dishChange);
  }

  deleteDish(id: number): Observable<boolean> {
    return this.http
      .delete<HttpResponse<any>>(`${this.api}/dish/${id}`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) =>
          response.status === 200 ? true : false
        )
      );
  }
}

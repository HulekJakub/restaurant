import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Rating } from '../store/datatypes';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private http: HttpClient) { }

  api = 'http://localhost:3000/api';

  getRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.api}/ratings`);
  }

  postRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(`${this.api}/rating`, rating);
  }

  deleteRating(id: number): Observable<boolean> {
    return this.http
      .delete<HttpResponse<any>>(`${this.api}/rating/${id}`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) =>
          response.status === 200 ? true : false
        )
      );
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { History } from '../store/datatypes';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClient) {}

  api = 'http://localhost:3000/api';

  getHistories(): Observable<History[]> {
    return this.http.get<History[]>(`${this.api}/histories`);
  }

  postHistory(history: History): Observable<History> {
    return this.http.post<History>(`${this.api}/history`, history);
  }
}

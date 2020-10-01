import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private prefix = 'http://localhost:3000/';

  constructor(private httpClient: HttpClient, private sessionService: SessionService) {}

  put<T>(path: string, body: any): Observable<T> {
    return this.httpClient.put<T>(this.prefix + path, body, {
      headers: this.buildHeaders(),
    });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.httpClient.post<T>(this.prefix + path, body, {
      headers: this.buildHeaders(),
    });
  }

  get<T>(path: string, body: any): Observable<T> {
    return this.httpClient.get<T>(this.prefix + path, {
      headers: this.buildHeaders(),
    });
  }

  delete<T>(path: string, body: any): Observable<T> {
    return this.httpClient.delete<T>(this.prefix + path, {
      headers: this.buildHeaders(),
    });
  }

  private buildHeaders(): Record<string, string> {
    return {authorization: this.sessionService.getToken() || ""};
  }
}

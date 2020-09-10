import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private prefix = 'http://localhost:3000/'

  constructor(private httpClient: HttpClient) { }

  put(path: string, body: any) {
    return this.httpClient.put(this.prefix + path, body, {headers: this.buildHeaders()})
  }
  
  post(path: string, body: any) {
    return this.httpClient.post(this.prefix + path, body, {headers: this.buildHeaders()})
  }
  
  get(path: string, body: any) {
    return this.httpClient.get(this.prefix + path, {headers: this.buildHeaders()})
  }
  
  delete(path: string, body: any) {
    return this.httpClient.delete(this.prefix + path, {headers: this.buildHeaders()})
  }

  private buildHeaders(): Record<string, string> {
    return {};
  }
  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  // Fetch raw clients
  getRawClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/raw/clients`);
  }

  // Fetch analyzed alerts
  getAnalyzedClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analyze?clients`);
  }
}

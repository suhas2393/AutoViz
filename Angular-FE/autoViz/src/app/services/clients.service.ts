import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = 'https://autoviz-backend.onrender.com';

  constructor(private http: HttpClient) {}

  // Fetch raw clients
  getRawClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/raw/clients`);
  }

  // Fetch analyzed clients
  getAnalyzedClients(columnsData : any): Observable<any> {
    return this.http.post(`${this.apiUrl}/analyze?clients`,columnsData);
  }
}

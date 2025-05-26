import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private apiUrl = 'https://autoviz-backend.onrender.com';

  constructor(private http: HttpClient) {}

  // Fetch raw alerts
  getRawAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/raw/alerts`);
  }

  // Fetch analyzed alerts
  getAnalyzedAlerts(columnsData : any): Observable<any> {
    return this.http.post(`${this.apiUrl}/analyze?alerts`,columnsData);
  }
}

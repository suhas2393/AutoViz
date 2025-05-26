import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  private apiUrl = 'https://autoviz-backend.onrender.com';

  constructor(private http: HttpClient) {}

  // Fetch raw clients
  getRawDevices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/raw/devices`);
  }

  // Fetch analyzed alerts
  getAnalyzedDevices(columnsData : any): Observable<any> {
    return this.http.post(`${this.apiUrl}/analyze?devices`,columnsData);
  }
}

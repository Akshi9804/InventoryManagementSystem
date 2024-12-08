import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsightService {
  private baseUrl = `https://inventorymanagementsystem-e8ga.onrender.com/insights/apiResponse`;

  constructor(private http: HttpClient) { }

  getInsights(prompt: string): Observable<any> {
    const body = {
      "prompt": prompt,
    };
    return this.http.post<any>(this.baseUrl, body);
  }
}

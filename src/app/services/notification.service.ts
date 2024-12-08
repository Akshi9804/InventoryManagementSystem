import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'https://inventorymanagementsystem-e8ga.onrender.com/notification';

  constructor(private http:HttpClient) { }

  getAllNotifications(userId:string): Observable<ApiResponse<Notification>> {
    return this.http.post<ApiResponse<Notification>>(this.baseUrl,userId);
  }

  maskNotificationAsRead(notId:string): Observable<ApiResponse<Notification>> {
    return this.http.put<ApiResponse<Notification>>(this.baseUrl,notId);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockAdjustmentLog } from '../interfaces/stockAdjustmentLog.interface';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { UserActivityLog } from '../interfaces/user-activity-log.interface';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private baseUrl = 'https://inventorymanagementsystem-e8ga.onrender.com';

  constructor(private http:HttpClient) { }

  getStockAdjustmentLogs(): Observable<ApiResponse<StockAdjustmentLog>> {
    return this.http.get<ApiResponse<StockAdjustmentLog>>(`${this.baseUrl}/stock-adjustment-logs`);
  }
  getUserActivityLogs(): Observable<ApiResponse<UserActivityLog>> {
    return this.http.get<ApiResponse<UserActivityLog>>(`${this.baseUrl}/user-activity-log`);
  }
}

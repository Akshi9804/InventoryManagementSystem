import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { StockTransferLog } from '../interfaces/stock-transfer-log.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http:HttpClient) { }
  private baseUrl = 'https://inventorymanagementsystem-e8ga.onrender.com/location';


  getAllLocations(): Observable<ApiResponse<Location>> {
    return this.http.get<ApiResponse<Location>>(this.baseUrl);
  }

  getLocationById(locId:string):Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/find-location/${locId}`);
  }

  deleteLocation(locId:string):Observable<ApiResponse<String>> {
    return this.http.delete<ApiResponse<String>>(`${this.baseUrl}/delete/${locId}`);
  }

  addLocation(location:Location):Observable<ApiResponse<String>> {
    return this.http.post<ApiResponse<String>>(this.baseUrl,location);
  }

  addExistingItemForLocation(locId:string,itemId:string):Observable<ApiResponse<String>> {
    return this.http.put<ApiResponse<String>>(`${this.baseUrl}/add-existing-item`,{locId:locId,itemId:itemId});
  }

  deleteExistingItemForLocation(locId:string,itemName:string):Observable<ApiResponse<String>> {
    return this.http.put<ApiResponse<String>>(`${this.baseUrl}/delete-existing-item/${locId}`,itemName);
  }

  getAllLocationsByIds(ids:string[]): Observable<ApiResponse<Location>> {
    return this.http.post<ApiResponse<Location>>(`${this.baseUrl}/get-locations`,ids);
  }

  transferStock(data:any):Observable<ApiResponse<String>> {
    return this.http.post<ApiResponse<String>>(`${this.baseUrl}/transfer-stock`,data);
  }

  getStockTransferLogs():Observable<ApiResponse<StockTransferLog>> {
    return this.http.get<ApiResponse<StockTransferLog>>(`https://inventorymanagementsystem-e8ga.onrender.com/stock-transfer-logs`);
  }
}

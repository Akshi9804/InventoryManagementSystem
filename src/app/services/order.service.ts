import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../interfaces/order.interface';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'https://inventorymanagementsystem-e8ga.onrender.com/order';
  constructor(private http:HttpClient) { }

  getOrders(): Observable<ApiResponse<Order>>{
    return this.http.get<ApiResponse<Order>>(this.baseUrl);
  }

  addOrder(order:Order,userId:string,role:string): Observable<ApiResponse<String>>{
    return this.http.post<ApiResponse<String>>(`${this.baseUrl}/${userId}?role=${role}`,order);
  }

  getOrdersByUser(userId:string): Observable<ApiResponse<Order>>{
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/${userId}`);
  }
}

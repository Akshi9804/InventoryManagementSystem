import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://inventorymanagementsystem-e8ga.onrender.com/user';


  constructor(private http:HttpClient){}

  signupUser(user: User): Observable<ApiResponse<String>> {
    return this.http.post<ApiResponse<String>>(`${this.baseUrl}/signup`, user);
  }

  signinUser(cred: any): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/signin`, cred);
  }

  getStaff():Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/staff`);
  }

  getUnapprovedUsers():Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/no-role`);
  }

  approveUser(userId:string,role:string):Observable<ApiResponse<String>> {
    return this.http.put<ApiResponse<String>>(`${this.baseUrl}/approve-user/${userId}`,role);
  }

  declineUser(userId:string):Observable<ApiResponse<String>> {
    return this.http.delete<ApiResponse<String>>(`${this.baseUrl}/decline-user/${userId}`);
  }

  activateUser(userId:string):Observable<ApiResponse<String>> {
    return this.http.put<ApiResponse<String>>(`${this.baseUrl}/activate-user`,userId);
  }

  deactivateUser(userId:string):Observable<ApiResponse<String>> {
    return this.http.put<ApiResponse<String>>(`${this.baseUrl}/deactivate-user`,userId);
  }

}

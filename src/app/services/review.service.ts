import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Item } from '../interfaces/item.interface';
import { Review } from '../interfaces/review.interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'https://inventorymanagementsystem-e8ga.onrender.com/review';

  constructor(private http: HttpClient) { }

  getAllReviews(): Observable<ApiResponse<Review>> {
    return this.http.get<ApiResponse<Review>>(`${this.baseUrl}`);
  }

  // Add Item
  postReview(review:Review): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(this.baseUrl, review);
  }

}

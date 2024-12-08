import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Supplier } from '../interfaces/supplierInterface.interface';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private baseUrl = 'https://inventorymanagementsystem-e8ga.onrender.com/supplier';

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<ApiResponse<Supplier>> {
    return this.http.get<ApiResponse<Supplier>>(this.baseUrl);
  }

  // Add Supplier
  addSupplier(supplier: Supplier): Observable<ApiResponse<Supplier>> {
    return this.http.post<ApiResponse<Supplier>>(this.baseUrl, supplier);
  }

  getSupplier(supplierId: string): Observable<ApiResponse<Supplier>> {
    return this.http.get<ApiResponse<Supplier>>(`${this.baseUrl}/find-supplier/${supplierId}`);
  }

  deleteSupplier(supplierId:string):Observable<ApiResponse<String>>{
    return this.http.delete<ApiResponse<String>>(`${this.baseUrl}/delete/${supplierId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  addExistingItem(itemId:String, supplierId : String):Observable<ApiResponse<String>>{
      return this.http.put<ApiResponse<String>>(`${this.baseUrl}/add-existing-item/${supplierId}`,{itemId:itemId,supplierId:supplierId});
  }

  deleteExistingItem(itemId:String, supplierId : String):Observable<ApiResponse<String>>{
    return this.http.put<ApiResponse<String>>(`${this.baseUrl}/delete-item/${supplierId}`,{itemId:itemId,supplierId:supplierId});
}

}

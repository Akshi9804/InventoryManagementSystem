import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../interfaces/supplierInterface.interface';
import { SupplierService } from '../../services/supplier.service';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-suppliers',
  standalone: true,
  imports: [CommonModule,RouterLink,MatIconModule,MatButtonModule],
  templateUrl: './view-suppliers.component.html',
  styleUrl: './view-suppliers.component.scss'
})
export class ViewSuppliersComponent implements OnInit{
  suppliers: Supplier[] = [];
  isAdmin:boolean;

  constructor(private supplierService: SupplierService, private router:Router,
    private authService:AuthService
  ){}

  ngOnInit(): void {
    this.fetchSuppliers();
    this.isAdmin=this.authService.isUserAdmin();
  }


  navigateToAddSuppliers(){
    this.router.navigate(['/task/suppliers/add']);
  }


  fetchSuppliers() {
    this.supplierService.getSuppliers().subscribe((response) => {
      this.suppliers = response.data;
    });
  }

}

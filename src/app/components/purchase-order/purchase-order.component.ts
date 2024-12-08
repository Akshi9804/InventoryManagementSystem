import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { PurchaseOrder } from '../../interfaces/purchase-order.interface';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';  // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; 

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [MatTabsModule,CommonModule,ReactiveFormsModule,MatTableModule,MatCardModule,
    MatButtonModule, CustomDatePipe,MatFormFieldModule,MatInputModule, MatDatepickerModule,
    MatNativeDateModule,FormsModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss'
})
export class PurchaseOrderComponent implements OnInit {
  pendingOrders: PurchaseOrder[] =[];
  approvedOrders: PurchaseOrder[] = [];
  dataSource = new MatTableDataSource<PurchaseOrder>([]);
  displayedColumns: string[]=['poId','orderId', 'supplierName', "itemName" , 'quantity','orderDate','expectedDelivery','approvalStatus'];
  userId:string;

  // Filter properties
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private purchaseOrderService:PurchaseOrderService,private cdr: ChangeDetectorRef,private authService:AuthService){}

  ngOnInit(): void {
    this.fetchApprovedOrders();
    this.fetchPendingOrders();
    this.userId=this.authService.getUser().userId;
  }

  fetchPendingOrders(){
    this.purchaseOrderService.getPendingOrders().subscribe({
      next: (response) => {
        this.pendingOrders=response.data;
        console.log(this.pendingOrders);
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    })
  }

  fetchApprovedOrders(){
    this.purchaseOrderService.getApprovedOrders().subscribe({
      next: (response) => {
        this.approvedOrders=response.data;
        this.dataSource.data=this.approvedOrders;
        console.log(this.approvedOrders)
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    })
  }


  approveOrder(poId: string) {
    this.purchaseOrderService.approveRequest(poId,this.userId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.fetchApprovedOrders();
        this.fetchPendingOrders();
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  declineRequest(poId:string){
    this.purchaseOrderService.declineRequest(poId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.fetchApprovedOrders();
        this.fetchPendingOrders();
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }

  filterByDateRange(): void {
    let filteredOrders = this.approvedOrders;

    if (this.startDate && this.endDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= this.startDate && orderDate <= this.endDate;
      });
    }

    // Update the data source to reflect the filtered results
    this.dataSource.data = filteredOrders;
  }
}

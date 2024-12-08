import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { StockAdjustmentLog } from '../../interfaces/stockAdjustmentLog.interface';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { LogsService } from '../../services/logs.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';  // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [MatTabsModule,CommonModule,ReactiveFormsModule,MatTableModule,MatPaginatorModule,CustomDatePipe,
    MatFormFieldModule,MatInputModule, MatDatepickerModule,
    MatNativeDateModule,FormsModule
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent {
  stockLogs: StockAdjustmentLog[]=[];
  dataSource = new MatTableDataSource<StockAdjustmentLog>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filter properties
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private logsService:LogsService, private router:Router,private dialog:MatDialog){}
  ngOnInit(): void {
    this.fetchLogs();
  }
  displayedColumns: string[] = ['logId', 'itemId', "changeType" , "quantity" , 'reason','timeStamp'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigateToAddSuppliers(){
    this.router.navigate(['/task/suppliers/add']);
  }

  fetchLogs() {
    this.logsService.getStockAdjustmentLogs().subscribe((response) => {
      this.stockLogs = response.data; 
      this.dataSource.data = this.stockLogs;
    });
  }
  filterByDateRange(): void {
    let filteredOrders = this.stockLogs;

    if (this.startDate && this.endDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.timeStamp);
        return orderDate >= this.startDate && orderDate <= this.endDate;
      });
    }

    // Update the data source to reflect the filtered results
    this.dataSource.data = filteredOrders;
  }
}

import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { StockTransferLog } from '../../interfaces/stock-transfer-log.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LocationService } from '../../services/location.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';  // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; 


@Component({
  selector: 'app-stock-transfer-logs',
  standalone: true,
  imports: [MatTableModule,ReactiveFormsModule,CommonModule,MatPaginatorModule,CustomDatePipe,
    MatFormFieldModule,MatInputModule, MatDatepickerModule,
    MatNativeDateModule,FormsModule],
  templateUrl: './stock-transfer-logs.component.html',
  styleUrl: './stock-transfer-logs.component.scss'
})
export class StockTransferLogsComponent {
  transferLogs: StockTransferLog[]=[];
  dataSource = new MatTableDataSource<StockTransferLog>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filter properties
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private locationService:LocationService){}

  ngOnInit(): void {
    this.fetchLogs();
  }
  displayedColumns: string[] = ['itemId', "from", "to" , "quantity" , 'transferDate', 'deliveryDate' ,'status'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchLogs() {
    this.locationService.getStockTransferLogs().subscribe({
      next:(res)=>{
        this.transferLogs = res.data; 
        this.dataSource.data = this.transferLogs;
      },
      error: (error)=>{
        console.log("Error fetching stock transfer logs: ",error)
      }
    });
  }

  filterByDateRange(): void {
    let filteredOrders = this.transferLogs;

    if (this.startDate && this.endDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.transferDate);
        return orderDate >= this.startDate && orderDate <= this.endDate;
      });
    }

    // Update the data source to reflect the filtered results
    this.dataSource.data = filteredOrders;
  }
}

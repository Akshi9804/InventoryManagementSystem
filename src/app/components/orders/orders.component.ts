import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { SupplierService } from '../../services/supplier.service';
import { ItemService } from '../../services/item.service';
import { Supplier } from '../../interfaces/supplierInterface.interface';
import { Item } from '../../interfaces/item.interface';
import { OrderService } from '../../services/order.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Order } from '../../interfaces/order.interface';
import { LocationService } from '../../services/location.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { SnackbarService } from '../../services/snackbar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';  // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; 



@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatTabsModule,CommonModule,ReactiveFormsModule,MatTableModule, MatPaginatorModule,CustomDatePipe,
    MatFormFieldModule,MatInputModule, MatDatepickerModule,
    MatNativeDateModule,FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, AfterViewInit{
  addOrderForm!: FormGroup;
  disableAddOrder: boolean = true;
  suppliers: Supplier[] = [];
  items: Item[] = [];
  orderTypes = ['Incoming', 'Outgoing'];
  orders:Order[]=[];
  dataSource = new MatTableDataSource<Order>([]);
  displayedColumns: string[]=['orderId', 'supplierId', "itemId" , "orderType" , 'quantity','orderDate','deliveryDate','status'];
  availableLocations: any[] = []; 
  item:Item;
  user:User;

  // Filter properties
  startDate: Date | null = null;
  endDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private itemService: ItemService,
    private orderService:OrderService,
    private locationService:LocationService,
    private authService:AuthService,
    private snackbar:SnackbarService
  ) {
    this.constructForm();
  }

  ngOnInit() {
    this.fetchSuppliers();
    this.addOrderForm.statusChanges.subscribe((status) => {
      this.disableAddOrder = this.addOrderForm.invalid;
    });
    // Watch for changes in supplier selection
    this.addOrderForm.get('supplierId')?.valueChanges.subscribe((supplierId) => {
      if (supplierId) {
        const selectedSupplier = this.suppliers.find(s => s.supplierId === supplierId);
        if (selectedSupplier) {
          this.fetchItems(selectedSupplier);
        }
      } else {
        this.items = [];
      }
    });
    this.addOrderForm.get('itemId')?.valueChanges.subscribe((itemId) => {
      if (itemId) {
        this.itemService.getItem(itemId).subscribe((response) => {
          this.item = Array.isArray(response.data) ? response.data[0] : response.data;
          console.log(this.item);
          this.fetchLocationNames();
  
        });
      }
    });
    this.user=this.authService.getUser();
    this.getOrders();
  }

 


  constructForm() {
    this.addOrderForm = this.formBuilder.group({
      supplierId: ['', Validators.required], 
      itemId: ['', Validators.required],   
      orderType: ['', Validators.required],
      locId:['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]], // Quantity field
    });
  }

  validateOrderType(group: FormGroup) {
    const incoming = group.get('incoming')?.value;
    const outgoing = group.get('outgoing')?.value;
    return incoming || outgoing ? null : { required: true };
  }

  fetchSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (response) => {
        this.suppliers = response.data; // Assuming `data` contains the list of suppliers
      },
      error: (error) => {
        console.error('Error fetching suppliers:', error);
      }
    });
  }

  fetchItems(supplier: Supplier) {
    this.itemService.getAllItemsByIds(supplier.productsProvided).subscribe({
      next: (response) => {
        this.items = response.data; // Assuming `data` contains the list of items
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addOrder() {
    if (this.addOrderForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const orderData = this.addOrderForm.value;
    console.log('Order Data:', orderData);
    this.orderService.addOrder(orderData,this.user.userId,this.user.role).subscribe({
      next: (response) => {
        if(response.statusEntry.statusCode===1003)
        {
          this.addOrderForm.reset();
          this.disableAddOrder = true;
          this.getOrders();
          this.snackbar.showSnackbar("Order added succesfully");
        }else{
          this.snackbar.showSnackbar("Unable to place order")
        }
        
      },
      error: (error) => {
        console.error('Error adding supplier:', error);
        this.snackbar.showSnackbar("Error placing order");
      },
    });
  }

  getOrders(){
    if(this.user.role==='admin')
    {
      this.orderService.getOrders().subscribe({
        next: (response) => {
          this.orders=response.data;
          this.dataSource.data=this.orders;
        },
        error: (error) => {
          console.error('Error getting orders:', error);
        },
      });
    }else{
      this.orderService.getOrdersByUser(this.user.userId).subscribe({
        next: (response) => {
          this.orders=response.data;
          this.dataSource.data=this.orders;
        },
        error: (error) => {
          console.error('Error getting orders:', error);
        },
      });
    }
    
  }

  fetchLocationNames() {
    if (this.item?.availableLocations?.length) {
      const locationIds = this.item.availableLocations;

      this.locationService.getAllLocationsByIds(locationIds).subscribe({
        next: (response) => {
          if (response?.data) {
            this.availableLocations = response.data.map((location: any) => ({
              locId: location.locId, 
              locName: location.name, 
            }));
            console.log('Available locations:', this.availableLocations);
          } else {
            console.error('Failed to fetch locations');
          }
        },
        error: (error) => {
          console.error('Error fetching locations:', error);
        },
      });
    } else {
      this.availableLocations = [];
    }
  }

  filterByDateRange(): void {
    let filteredOrders = this.orders;

    if (this.startDate && this.endDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= this.startDate && orderDate <= this.endDate;
      });
    }
    this.dataSource.data = filteredOrders;
  }
  
}

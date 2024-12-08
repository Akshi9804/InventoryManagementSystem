import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../interfaces/item.interface';
import { ItemService } from '../../services/item.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { PricePipe } from '../../pipes/price.pipe';
import { AddNewItemComponent } from '../add-new-item/add-new-item.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule,MatIconModule,RouterLink,CommonModule,CustomDatePipe,PricePipe,MatFormFieldModule,MatSelectModule,MatOptionModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, AfterViewInit {
  items: Item[] = [];
  dataSource = new MatTableDataSource<Item>([]);
  isAdmin:boolean;
  selectedCategory: string = '';
  selectedQuantity: string = '';
  categories: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private itemService: ItemService,private authService:AuthService,private dialog: MatDialog,private snackbarService:SnackbarService){}

  ngOnInit(): void {
    this.fetchItems();
    this.isAdmin=this.authService.isUserAdmin();
  }
  displayedColumns: string[] = ['itemId', 'name', "category" , "quantity" , 'price','reorderLevel','lastUpdated','viewItem'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openAddItem(){
    const dialogRef = this.dialog.open(AddNewItemComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchItems();
    });
  }

  fetchItems(){
    this.itemService.getItems().subscribe({
      next: (res)=>{
        this.items = res.data;
        this.dataSource.data = this.items;
        this.fetchCategories(); 
      },
      error:(error)=>{
        console.log("Error fetching data");
      }
    });
  }

  fetchCategories() {
    // Assuming categories are part of the data, if not fetch from a service
    this.categories = Array.from(new Set(this.items.map(item => item.category)));
  }

  applyFilters() {
    let filteredItems = this.items;

    if (this.selectedCategory) {
      filteredItems = filteredItems.filter(item => item.category === this.selectedCategory);
    }

    if (this.selectedQuantity) {
      if (this.selectedQuantity === 'low') {
        filteredItems = filteredItems.filter(item => item.quantity < 50);
      } else if (this.selectedQuantity === 'medium') {
        filteredItems = filteredItems.filter(item => item.quantity >= 50 && item.quantity <= 100);
      } else if (this.selectedQuantity === 'high') {
        filteredItems = filteredItems.filter(item => item.quantity > 100);
      }
    }

    this.dataSource.data = filteredItems;
  }

}

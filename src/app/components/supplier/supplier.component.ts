import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../interfaces/supplierInterface.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { Item } from '../../interfaces/item.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { ConfirmationDialogComponent } from '../common-elements/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [MatDialogModule,CommonModule,MatTableModule,MatIconModule,MatButtonModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent implements OnInit{
  supplier : Supplier ;
  items : Item[]=[];
  dataSource = new MatTableDataSource<Item>([]);
  isAdmin:boolean;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private route: ActivatedRoute, private supplierService: SupplierService, 
    private itemService:ItemService,private dialog: MatDialog,
    private router:Router,private snackbarService:SnackbarService,
  private authService:AuthService) {}

  ngOnInit() {
    const supplierId = this.route.snapshot.params['supplierId'];
  if (supplierId) {
   this.fetchData(supplierId)
  }
  this.isAdmin=this.authService.isUserAdmin();
  }
  
  displayedColumns: string[] = ['itemId', 'name', "category","deleteItem"];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteSupplier(){
    this.supplierService.deleteSupplier(this.supplier.supplierId).subscribe({
      next: (response) => {
        if(response.statusEntry.statusCode===1004)
        {
          console.log('Delete successful:', response);
          this.router.navigate(["/task/suppliers"]);
          this.snackbarService.showSnackbar("Supplier deleted successfully");
        }
        
      },
      error: (error) => console.error('Delete error:', error),
    });
  }

  openConfirmationDialogForDelete(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this.deleteSupplier();
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  navigateToAddItem(){
    this.router.navigate(['/task/suppliers',this.supplier.supplierId,'add-item']);
  }

  openConfirmationDialogForDeleteItem(itemId:string){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result (type):', typeof result, 'Value:', result);
      if (result == "true") { // Explicitly check for `true`
        this.deleteExistingItem(itemId);
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  deleteExistingItem(itemId:string){
    this.supplierService.deleteExistingItem(itemId,this.supplier.supplierId).subscribe({
      next: (res) => {
        console.log(res.data);
        const message = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
            console.log(message);
            this.snackbarService.showSnackbar(message);
        this.fetchData(this.supplier.supplierId);
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      }
    })
  }

fetchData(supplierId:string){
  this.supplierService.getSupplier(supplierId).subscribe((response) => {
    this.supplier = Array.isArray(response.data) ? response.data[0] : response.data;

    // Fetch items only after supplier data is loaded
    this.itemService.getAllItemsByIds(this.supplier.productsProvided).subscribe((response) => {
      this.items = response.data; 
      this.dataSource.data = this.items;
    });
  });
}
  
}

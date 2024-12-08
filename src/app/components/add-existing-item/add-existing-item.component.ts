import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Item } from '../../interfaces/item.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../../services/supplier.service';
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-add-existing-item',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatPaginator, MatTableModule,MatIconModule,MatButtonModule],
  templateUrl: './add-existing-item.component.html',
  styleUrl: './add-existing-item.component.scss'
})
export class AddExistingItemComponent implements OnInit, AfterViewInit {
  items: Item[] = [];
  supplierId!: String;
  dataSource = new MatTableDataSource<Item>();
  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private itemService: ItemService, private supplierService: SupplierService,private snackbarService:SnackbarService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    const supplierId = this.route.snapshot.paramMap.get('supplierId');
    if (supplierId)
      this.supplierId = supplierId;
    // Fetch items only after supplier data is loaded
    this.fetchItems();
  }

  openAddItem() {
    const dialogRef = this.dialog.open(AddItemDialogComponent, {
      width: '400px',
      data: { supplierId: this.supplierId },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchItems();
    });
  }

  displayedColumns: string[] = ['itemId', 'name', "category", 'addItem'];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  addExistingItem(itemId: String) {
    this.supplierService.addExistingItem(itemId, this.supplierId).subscribe({
      next: (res) => {
        console.log(res);
        const message = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
            console.log(message);
            this.snackbarService.showSnackbar(message);
        this.router.navigate(['/task/suppliers',this.supplierId])
      },
      error:(err)=>{
        console.log("Error submitting data: ",err);
        this.snackbarService.showSnackbar("Error adding item");
      }
    })
  }

  fetchItems(){
    this.itemService.getItems().subscribe((response) => {
      this.items = response.data;
      this.dataSource.data = this.items;
    });
  }
}



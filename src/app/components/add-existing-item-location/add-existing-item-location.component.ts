import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-add-existing-item-location',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatPaginator, MatTableModule,MatIconModule,MatButtonModule],
  templateUrl: './add-existing-item-location.component.html',
  styleUrl: './add-existing-item-location.component.scss'
})
export class AddExistingItemLocationComponent implements OnInit, AfterViewInit {

  items: Item[] = [];
  locId!: string;
  dataSource = new MatTableDataSource<Item>();
  constructor(private dialog: MatDialog, private route: ActivatedRoute, private router: Router, private itemService: ItemService, private locationService:LocationService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngOnInit(): void {
    const locId = this.route.snapshot.paramMap.get('locId');
    if (locId)
      this.locId = locId;
    // Fetch items only after supplier data is loaded
    this.fetchItems();
  }

  openAddItem() {
    const dialogRef = this.dialog.open(AddExistingItemLocationComponent, {
      width: '400px',
      data: { locId: this.locId },
    });
  }

  displayedColumns: string[] = ['itemId', 'name', "category", 'addItem'];
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  addExistingItem(itemId: string) {
    this.locationService.addExistingItemForLocation(this.locId,itemId).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/task/location',this.locId])
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


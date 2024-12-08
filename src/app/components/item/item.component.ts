import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';
import { Item } from '../../interfaces/item.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditItemDialogComponent } from '../edit-item-dialog/edit-item-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import { ConfirmationDialogComponent } from '../common-elements/confirmation-dialog/confirmation-dialog.component';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { PricePipe } from '../../pipes/price.pipe';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [MatIconModule,CommonModule,CustomDatePipe,PricePipe],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit{
  item:Item;
  message:String;
  locations:string[];
  isAdmin:boolean;
  isBarcode:boolean;
  barcodeUrl:string;

  constructor(private dialog: MatDialog,private itemService:ItemService,
    private route:ActivatedRoute,private router : Router,
  private locationService:LocationService,private authService: AuthService,private snackbar:SnackbarService){}

  ngOnInit() {
   this.refreshItemData();
    this.isAdmin=this.authService.isUserAdmin();
    this.isBarcode=false;
  }

  openEditItem(){
    const dialogRef = this.dialog.open(EditItemDialogComponent, {
      width: '600px',
      data: { item: this.item },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.refreshItemData();
    });
  }

  openConfirmationDialogForDelete(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") { 
        this.deleteItem();
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  deleteItem(){
    this.itemService.deleteItem(this.item.itemId).subscribe((res)=>{
      this.message=Array.isArray(res.data)? res.data[0]: res.data;
      this.router.navigate(['/task/inventory']);

    })
  }

  refreshItemData() {
    const itemId = this.route.snapshot.params['itemId'];
    if (itemId) {
      this.itemService.getItem(itemId).subscribe((response) => {
        this.item = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log(this.item);
        this.fetchLocationNames();

      });
    }
  }
  fetchLocationNames() {
    if (this.item?.availableLocations?.length) {
      const locationIds = this.item.availableLocations;
      
      // Call getAllLocationByIds from LocationService to fetch location details
      this.locationService.getAllLocationsByIds(locationIds).subscribe((response) => {
        if (response?.data) {
          // Map the locations to their names
          this.locations = response.data.map((location: any) => location.name);
          console.log('Location names:', this.locations);
        } else {
          console.error('Failed to fetch locations');
        }
      });
    }
  }

  getBarcode(){
    
    const itemId = this.item?.itemId;
  if (itemId) {
    this.itemService.getBarcode(itemId).subscribe({
      next: (response) => {
        console.log(response.data);
        const barcodes = Array.isArray(response.data) ? response.data[0] : response.data;
        console.log(barcodes) 
        if (barcodes.barcode) {
          const barcodeUrl = barcodes.barcode; 
          console.log('Barcode URL:', barcodeUrl);
          this.isBarcode=true;
          this.barcodeUrl=barcodeUrl;
        } else {
          console.error('No barcode data available');
          this.snackbar.showSnackbar("Barcode is not available");
        }
      },
      error: (error) => {
        console.error('Error fetching barcode:', error);
        this.snackbar.showSnackbar("Error fetching barcore");
      },
    });
  } else {
    console.error('Item ID is missing');
  }
  }

}


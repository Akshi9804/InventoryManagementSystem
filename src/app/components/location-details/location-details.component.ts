import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';
import { ItemService } from '../../services/item.service';
import { Item } from '../../interfaces/item.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SnackbarService } from '../../services/snackbar.service';
import { ConfirmationDialogComponent } from '../common-elements/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule],
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss'],
})
export class LocationDetailsComponent implements OnInit {
  location: Location;
  items: Item[];
  itemsAtLocation:any[];
  isAdmin:boolean;

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private itemService: ItemService,
    private router:Router,
    private authService:AuthService,
    private snackbar:SnackbarService,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.fetchLocationDetails();
    this.isAdmin=this.authService.isUserAdmin();
  }

  deleteExistingItem(itemId:string){
    this.locationService.deleteExistingItemForLocation(this.location.locId,itemId).subscribe({
      next:(res)=>{
        if(res.statusEntry.statusCode===1005)
        {
          const message = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
            console.log(message);
            this.snackbar.showSnackbar(message);
            this.fetchLocationDetails();
        }else{
          this.snackbar.showSnackbar("Item deletion failed")
        }
      },
      error:(error)=>{
        this.snackbar.showSnackbar("Error updating data");
        console.log("Error updating data: ",error);
      }
    })
  }

  openConfirmationDialogForDeleteItem(id:string){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this item?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this.deleteExistingItem(id);
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }
  openConfirmationDialogForDeleteLocation(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Are you sure you want to delete this location?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "true") {
        this.deleteLocation();
      } else {
        console.log('Deletion canceled by user.');
      }
    });
  }

  deleteLocation(){
    this.locationService.deleteLocation(this.location.locId).subscribe({
      next:(res)=>{
        if(res.statusEntry.statusCode===1004)
        {
          const message = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
            console.log(message);
            this.snackbar.showSnackbar(message);
            this.router.navigate(['/task/location'])
        }else{
          this.snackbar.showSnackbar("Location deletion failed")
        }
      },
      error:(error)=>{
        this.snackbar.showSnackbar("Error deleting data");
        console.log("Error deleting data: ",error);
      }
    })
  }

  fetchLocationDetails() {
    const locId = this.route.snapshot.paramMap.get('locId');
    if (locId) {
      this.locationService.getLocationById(locId).subscribe({
        next: (res) => {

          const locationData = res.data;
          
          // Mapping the location data including stockDetails
          this.location = {
            locId: locationData.locId,
            name: locationData.name,
            address: locationData.address,
            stockDetails: new Map(
              Object.entries(locationData.stockDetails || {}).map(
                ([key, value]) => [key, value] // Convert stockDetails to a Map
              )
            ),
          };
          const itemIds=Array.from(this.location.stockDetails.keys()) as string[];
          this.itemService.getAllItemsByIds(itemIds).subscribe((itemRes) => {
            this.items = itemRes.data;
            console.log(this.items);
            this.itemsAtLocation = Array.from(this.location.stockDetails.entries()).map(
              ([itemId, quantity]) => {
                const item = this.items.find((item) => item.itemId === itemId);
                return {
                  itemId:item.itemId,
                  itemName: item ? item.name : 'Unknown Item', // Fallback if no item is found
                  quantity: quantity,
                };
              }
            );
          });
        },
        error: (error) => {
          console.error('Error fetching location data: ', error);
        },
      });
    }
  }

  openAddExistingItem(){
    this.router.navigate(['/task/location',this.location.locId,'add-existing-item-location']);
  }
}

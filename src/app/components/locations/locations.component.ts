import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';
import { MatIconModule } from '@angular/material/icon';
import { AddNewLocationComponent } from '../add-new-location/add-new-location.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule, RouterLink],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
})
export class LocationsComponent implements OnInit {
  locations: Location[] = [];
  isAdmin:boolean;

  constructor(
    private locationService: LocationService,
    private dialog: MatDialog,
    private router: Router,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.fetchLocations();
    this.isAdmin=this.authService.isUserAdmin();
  }

  fetchLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (res) => {
        this.locations = res.data.map((item: any) => ({
          locId: item.locId,
          name: item.name,
          address: item.address,
          stockDetails: item.stockDetails,  // Directly assign the stockDetails as it can be any
        }));
        console.log(this.locations);
      },
      error: (error) => {
        console.log('Error fetching data: ', error);
      },
    });
  }

  openLocationDialog() {
    const dialogRef = this.dialog.open(AddNewLocationComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchLocations();
    });
  }

  // Navigate to location details
  viewLocationDetails(locId: string) {
    this.router.navigate(['/location-details', locId]);
  }
}

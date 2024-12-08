import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { ItemService } from '../../services/item.service';
import { Location } from '../../interfaces/location.interface';

@Component({
  selector: 'app-add-new-item',
  standalone: true,
  imports: [MatDialogModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.scss']
})
export class AddNewItemComponent {
  addItemForm!: FormGroup;
  locations: Location[] = [];
  disableAddItem: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AddNewItemComponent>,
    private itemService: ItemService,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private snackbarService: SnackbarService
  ) {
    this.constructForm();
    this.fetchLocations();
  }

  // Form initialization
  constructForm() {
    this.addItemForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Item name
      category: ['', [Validators.required]],                     // Item category
      quantity: [{value:0, disabled: true}], // Quantity
      price: [0, [Validators.required, Validators.min(0.01)]],   // Price
      reorderLevel: [1, [Validators.required, Validators.min(1)]], // Reorder level
      availableLocations: this.formBuilder.array([]),            // Array of locations
    });
  }

  // Get available locations as FormArray
  get locationsFormArray(): FormArray {
    return this.addItemForm.get('availableLocations') as FormArray;
  }

  // Add a location
  addLocation(locationId: string = '') {
    this.locationsFormArray.push(this.formBuilder.control(locationId, Validators.required));
  }

  // Remove a location
  removeLocation(index: number) {
    this.locationsFormArray.removeAt(index);
  }

  // Close the dialog
  close(): void {
    this.dialogRef.close();
  }

  // Fetch all locations for selection
  fetchLocations() {
    this.locationService.getAllLocations().subscribe({
      next: (res) => {
        const allLocations = res.data.map((item: any) => ({
          locId: item.locId,
          name: item.name,
          address: item.address,
          stockDetails: item.stockDetails,
        }));
        this.locations = allLocations;
      },
      error: (error) => {
        console.error('Error fetching locations:', error);
      },
    });
  }

  // Add a new item to the inventory
  addItem() {
    if (this.addItemForm.valid) {
      const newItem = this.addItemForm.value;
      this.itemService.addItem(newItem).subscribe({
        next: (response) => {
          if (response.statusEntry.statusCode === 1003) {
            console.log('Item added successfully:', response);
            this.snackbarService.showSnackbar('Item added successfully');
            this.dialogRef.close(); // Close dialog on success
          } else {
            this.snackbarService.showSnackbar('Unable to add item');
          }
        },
        error: (error) => {
          console.error('Error adding item:', error);
          this.snackbarService.showSnackbar('Failed to add item');
        },
      });
    } else {
      this.snackbarService.showSnackbar('Please fill all required fields correctly.');
    }
  }
}

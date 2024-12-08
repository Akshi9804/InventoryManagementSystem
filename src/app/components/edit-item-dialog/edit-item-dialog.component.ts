import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ItemService } from '../../services/item.service';
import { Item } from '../../interfaces/item.interface';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { Location } from '../../interfaces/location.interface';

@Component({
  selector: 'app-edit-item-dialog',
  standalone: true,
  imports: [CommonModule,MatDialogModule,ReactiveFormsModule],
  templateUrl: './edit-item-dialog.component.html',
  styleUrl: './edit-item-dialog.component.scss'
})
export class EditItemDialogComponent {
  item!: Item;
  locations:Location[]=[];
  disableAddItem: boolean = false;
  editItemForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditItemDialogComponent>,
    private itemService:ItemService,
    private formBuilder:FormBuilder,
    private locationService:LocationService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { item:Item } 
  ) {
    this.constructForm();
    this.fetchLocations();
  }
  

  constructForm() {
    this.editItemForm = this.formBuilder.group({
      itemId: [{ value: this.data.item.itemId, disabled: true }],
      name: [{ value: this.data.item.name, disabled: true }],
      category: [this.data.item.category, [Validators.required, Validators.minLength(5)]],
      quantity: [{value: this.data.item.quantity, disabled: true}],
      price: [this.data.item.price, [Validators.required, Validators.min(0.01)]],
      availableLocations: this.formBuilder.array([]),
      reorderLevel: [this.data.item.reorderLevel, [Validators.required, Validators.min(1)]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }
 
  
    get locationsFormArray(): FormArray {
      return this.editItemForm.get('availableLocations') as FormArray;
    }
  
    addLocation(locationId: string = '') {
      this.locationsFormArray.push(this.formBuilder.control(locationId, Validators.required));
    }
  
    removeLocation(index: number) {
      this.locationsFormArray.removeAt(index);
    }

  editItem(){
    if (this.editItemForm.valid) {
      const updatedItem = {
        ...this.data.item,
        ...this.editItemForm.getRawValue() 
      };
      console.log(updatedItem);
      this.itemService.editItem(updatedItem).subscribe(
        (response) => {
          this.dialogRef.close(response.data);
        },
        (error) => {
          console.error('Error updating item:', error);
          alert('Failed to update item. Please try again.');
        }
      );
    }
  }

  fetchLocations(){
    this.locationService.getAllLocations().subscribe({
      next: (res) => {
        const allLocations = res.data.map((item: any) => ({
          locId: item.locId,
          name: item.name,
          address: item.address,
          stockDetails: item.stockDetails,
        }));
  
        // Filter out locations that are already in `availableLocations`
        this.locations = allLocations.filter(
          (location) => !this.data.item.availableLocations.includes(location.locId)
        );
  
        console.log('Filtered locations:', this.locations);
      },
      error: (error) => {
        console.log('Error fetching data: ', error);
      },
    });
  }
}

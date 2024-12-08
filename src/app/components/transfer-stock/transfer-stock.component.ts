import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../interfaces/item.interface';
import { LocationService } from '../../services/location.service';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer-stock',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './transfer-stock.component.html',
  styleUrl: './transfer-stock.component.scss'
})
export class TransferStockComponent {
  stockTransferForm!: FormGroup;
  disableStockTransferButton: boolean = true;
  items: Item[] = [];
  fromLocations: any[] = [];
  toLocations: any[] = [];
  item!: Item;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private locationService: LocationService,

  ) {
    this.constructForm();
  }

  ngOnInit() {
    this.fetchItems();
    this.stockTransferForm.statusChanges.subscribe((status) => {
      this.disableStockTransferButton = this.stockTransferForm.invalid;
    });

    // Watch for changes in item selection
    this.stockTransferForm.get('itemId')?.valueChanges.subscribe((itemId) => {
      if (itemId) {
        this.itemService.getItem(itemId).subscribe({
          next: (response) => {
            this.item = Array.isArray(response.data) ? response.data[0] : response.data;
            this.fetchFromLocations();
          },
          error: (error) => {
            console.error('Error fetching item details:', error);
          },
        });
      } else {
        this.fromLocations = [];
        this.toLocations = [];
      }
    });

    // Watch for changes in from location selection
    this.stockTransferForm.get('from')?.valueChanges.subscribe((fromLocationId) => {
      if (fromLocationId) {
        this.toLocations = this.fromLocations.filter((location) => location.locId !== fromLocationId);
      } else {
        this.toLocations = [];
      }
    });
  }

  constructForm() {
    this.stockTransferForm = this.formBuilder.group({
      itemId: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  fetchItems() {
    this.itemService.getItems().subscribe({
      next: (response) => {
        this.items = response.data;
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      },
    });
  }

  fetchFromLocations() {
    if (this.item?.availableLocations?.length) {
      const locationIds = this.item.availableLocations;

      this.locationService.getAllLocationsByIds(locationIds).subscribe({
        next: (response) => {
          this.fromLocations = response.data.map((location: any) => ({
            locId: location.locId,
            locName: location.name,
          }));
          this.toLocations = []; // Reset toLocations when fromLocations are fetched
        },
        error: (error) => {
          console.error('Error fetching from locations:', error);
        },
      });
    } else {
      this.fromLocations = [];
      this.toLocations = [];
    }
  }
  submitStockTransferForm() {
    if (this.stockTransferForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const transferData = this.stockTransferForm.value;
    console.log(transferData);
    this.locationService.transferStock(transferData).subscribe({
      next: (response) => {
        this.stockTransferForm.reset();
      this.disableStockTransferButton = true;
      console.log(response.data);
      // this.getOrders();
      },
      error: (error) => {
        console.error('Error adding supplier:', error);
      },
    });
  }
}

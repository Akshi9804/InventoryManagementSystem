export interface Item {
    itemId: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    reorderLevel: number;
    lastUpdated: Date;
    availableLocations:string[];
  }
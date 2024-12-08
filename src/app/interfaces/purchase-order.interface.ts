export interface PurchaseOrder{
    poId: string;
    orderId:string;
    supplierId:string;
    supplierName:string;
    itemId: string; 
    itemName:string;
    quantity:number; 
    orderDate:Date; 
    expectedDelivery: Date;  
    approvalStatus: string ;
    loggedBy: string;
}
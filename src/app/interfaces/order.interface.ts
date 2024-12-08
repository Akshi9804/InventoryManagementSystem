export interface Order{
    orderId:string;
    supplierId:string;
    orderType: string;
    itemId: string; 
    quantity:number; 
    locId:string;
    orderDate:Date; 
    deliveryDate: Date;  
    status: string 
}
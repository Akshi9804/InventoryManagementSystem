export interface StockTransferLog {
    id: string ;
    logId :string;
    itemId: string;
    from:string;
    to: string;
    quantity:number;
    transferDate:Date;
    deliveryDate:Date;
    loggedBy:string;
    status:string;
}
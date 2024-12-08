export interface StockAdjustmentLog {
    id: string ;
    logId :string;
    itemId: string;
    changeType:string;
    quantity:number;
    reason: string;
    loggedBy:string;
    timeStamp:Date ;
}
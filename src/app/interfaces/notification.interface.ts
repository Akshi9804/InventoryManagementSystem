export interface Notification{
    notificationId:string;
    userId:string;
    message:string;
    alertType:string;
    timeStamp:Date;
    read:boolean;
}
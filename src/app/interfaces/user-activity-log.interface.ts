export interface UserActivityLog {
    logId :string;
    userId: string;
    action:string;
    description: string;
    timeStamp:Date;
}


export interface StatusEntry {
    statusCode: number;
    statusMessage: string;
    statusType: string;
  }
  

  
  export interface ApiResponse<T> {
    statusEntry: StatusEntry;
    data: T[];
  }
  
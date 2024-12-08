import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { User } from '../../interfaces/user.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserActivityLog } from '../../interfaces/user-activity-log.interface';
import { UserService } from '../../services/user.service';
import { LogsService } from '../../services/logs.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { CustomDatePipe } from '../../pipes/custom-date.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';  // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; 


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTabsModule,CommonModule,MatTableModule,ReactiveFormsModule,FormsModule,CustomDatePipe,
    MatFormFieldModule,MatInputModule, MatDatepickerModule,
    MatNativeDateModule,FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  unApprovedUsers: User[] =[];
  staff: User[] = [];
  userActivityLogs: UserActivityLog[] = [];
  dataSource = new MatTableDataSource<UserActivityLog>([]);
  displayedColumns: string[]=['userId','action', 'description', "timeStamp" ];
  roles: string[] = ['admin', 'staff']; // Available roles
  selectedRole: string = '';

  // Filter properties
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(private userService:UserService,private logsService:LogsService,private snackBar:SnackbarService,private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.fetchStaff();
    this.fetchUnapprovedUsers();
    this.fetchUserActivityLogs();
    
  }
  fetchStaff(){
    this.userService.getStaff().subscribe({
      next: (response) => {
        this.staff=response.data;
        console.log(this.staff);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    })
  }

  fetchUnapprovedUsers(){
    this.userService.getUnapprovedUsers().subscribe({
      next: (response) => {
        if(response.statusEntry.statusCode===1001)
        {
          this.unApprovedUsers=response.data;
          console.log(this.unApprovedUsers);
        }else{
          this.unApprovedUsers=[];
        }
        
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    })
  }
  fetchUserActivityLogs(){
    this.logsService.getUserActivityLogs().subscribe({
      next: (response) => {
        this.userActivityLogs=response.data;
        console.log(response.data)
        this.dataSource.data=this.userActivityLogs;
        console.log(this.unApprovedUsers);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    })
  }


  approveUser(userId:string,selectedRole){
    if (selectedRole && selectedRole.trim().length > 0) {
      this.userService.approveUser(userId, selectedRole).subscribe({
        next: (response) => {
          if (response.statusEntry.statusCode === 1005) {
            this.snackBar.showSnackbar("User approved");
            console.log(response.data);
            this.fetchStaff();
            this.fetchUnapprovedUsers();
          } else {
            this.snackBar.showSnackbar("User approval failed");
          }
        },
        error: (error) => {
          console.error('Error updating data:', error);
        }
      });
    } else {
      // Notify the user to select a role if not already selected
      this.snackBar.showSnackbar("Please select a role before approving");
    }
  }
  declineUser(userId:string)
  {
    this.userService.declineUser(userId).subscribe({
      next: (response) => {
        if(response.statusEntry.statusCode===1004){
          this.snackBar.showSnackbar("User request declined")
          console.log(response.data);
          this.fetchStaff();
          this.fetchUnapprovedUsers();
        }else{
          this.snackBar.showSnackbar("User request declination failed")
        }
      },
      error: (error) => {
        console.error('Error updating data:', error);
      }
    })
  }

  deactivateUser(userId:string){
    this.userService.deactivateUser(userId).subscribe({
      next: (response) => {
        if(response.statusEntry.statusCode===1005){
          this.snackBar.showSnackbar("User deactivated")
          console.log(response.data);
          this.fetchStaff();
        }else{
          this.snackBar.showSnackbar("User deactivation failed")
        }
      },
      error: (error) => {
        console.error('Error updating data:', error);
      }
    })
  }

  activateUser(userId:string){
    this.userService.activateUser(userId).subscribe({
      next: (response) => {
        if(response.statusEntry.statusCode===1005){
          this.snackBar.showSnackbar("User activated")
          console.log(response.data);
          this.fetchStaff();
        }else{
          this.snackBar.showSnackbar("User activation failed")
        }
      },
      error: (error) => {
        console.error('Error updating data:', error);
      }
    })
  }
  filterByDateRange(): void {
    let filteredOrders = this.userActivityLogs;

    if (this.startDate && this.endDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.timeStamp);
        return orderDate >= this.startDate && orderDate <= this.endDate;
      });
    }

    // Update the data source to reflect the filtered results
    this.dataSource.data = filteredOrders;
  }
}

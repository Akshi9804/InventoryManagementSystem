import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-locations',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule],
  templateUrl: './manage-locations.component.html',
  styleUrl: './manage-locations.component.scss'
})
export class ManageLocationsComponent implements OnInit{

  constructor(private router:Router,private authService:AuthService){}
  isAdmin:boolean;
  isActive(route: string): boolean {
    return this.router.url === route; // Compare the current URL with the given route
  }
  ngOnInit(){
    this.isAdmin=this.authService.isUserAdmin();
  }
}

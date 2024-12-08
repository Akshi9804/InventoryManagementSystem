import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.scss'
})
export class MenubarComponent implements OnInit {
  constructor(private authService:AuthService, private router: Router) { }
  isAdmin:boolean;
  ngOnInit(): void {
    this.authService.isAdmin$.subscribe((authStatus) => {
      this.isAdmin = authStatus;
      console.log('Is Authenticated:', this.isAdmin);
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route; // Compare the current URL with the given route
  }

  }

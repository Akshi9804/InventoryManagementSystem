import { Component, ElementRef, ViewChild, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SigninComponent } from '../signin/signin.component';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule,SigninComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  isLoggedIn:boolean=false;

  @ViewChild(SigninComponent) signin!: SigninComponent;

  constructor(private authService:AuthService,private snackbar:SnackbarService){}
  ngOnInit(){
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isLoggedIn = isAuthenticated;
      console.log('Auth status updated:', this.isLoggedIn);
    });
  }
  showSignIn() {
    this.signin.openOverlay();
    
  }

  signOut(){
    this.authService.logout();
    this.snackbar.showSnackbar("Logged out successfully");
  }


}

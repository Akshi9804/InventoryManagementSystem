import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  isVisible = false;
  isLogin: boolean = true;
  isSignUp: boolean = false;
  disableLogin: boolean = false;
  disableSignin: boolean = false;

  userLoginDetails!: FormGroup;
  userRegistrationDetails!: FormGroup;
  constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router,private authService:AuthService,private snackbarService:SnackbarService) {
    this.constructForm();
  }

  

  constructForm() {
    this.userLoginDetails = this.formBuilder.group({
      nameOrEmail: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.userRegistrationDetails = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  toggleLoginSignup() {
    this.isLogin = !this.isLogin;
    this.isSignUp = !this.isSignUp;
    this.userLoginDetails.reset();
    this.userRegistrationDetails.reset();
  }

  openOverlay() {
    this.isVisible = true;
  }

  closeOverlay() {
    this.isVisible = false;
    this.userLoginDetails.reset();
    this.userRegistrationDetails.reset();
  }

  submitLoginForm() {
    if (this.userLoginDetails?.valid) {
      this.disableLogin = true;
      console.log(this.userLoginDetails.value);
      this.userService.signinUser(this.userLoginDetails.value).subscribe({
        next:(res)=>{
          
          if(res.statusEntry.statusCode!==1001)
          {
            const message = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
            console.log(message);
            this.snackbarService.showSnackbar(message);
            this.disableLogin=false;
          }
          else{
            const user:User= Array.isArray(res.data) ? res.data[0]:res.data;
            this.authService.login(user);
            console.log(user);
            this.router.navigate(['/task']);  
            this.snackbarService.showSnackbar("Logged in successfully");
            
          }
          
        },
        error : (error)=>{
          console.log("Error submitting data: ",error);
        }
      });
      this.userLoginDetails.reset();
    this.userRegistrationDetails.reset();
    }
  }
  submitRegistrationForm() {
    if (this.userRegistrationDetails?.valid) {
      const signUpDetails: User= this.userRegistrationDetails.value;
      this.userService.signupUser(signUpDetails).subscribe({
        next:(res)=>{
          if(res.statusEntry.statusCode!==1003){
            const message = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
            console.log(message);
            this.snackbarService.showSnackbar(message);
          }
          else{
            this.toggleLoginSignup();
            this.snackbarService.showSnackbar("Registered successfully");
          }
          
        },
        error : (error)=>{
          console.log("Error submitting data: ",error);
        }
      });
      this.userLoginDetails.reset();
    this.userRegistrationDetails.reset();
    }
  }
}

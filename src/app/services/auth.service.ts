import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$ = new BehaviorSubject<boolean>(false).asObservable();

  private isAdminSubject: BehaviorSubject<boolean>;
  isAdmin$ = new BehaviorSubject<boolean>(false).asObservable();

  private userSubject: BehaviorSubject<User | null>;
  user$ = new BehaviorSubject<User | null>(null).asObservable();

  constructor(private router:Router) {
    // Initialize state from sessionStorage
    const isAuthenticated = this.checkLoginFromSession();
    const isAdmin = this.checkAdminFromSession();
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');

    // Initialize the BehaviorSubjects
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(isAuthenticated);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    this.isAdminSubject = new BehaviorSubject<boolean>(isAdmin);
    this.isAdmin$ = this.isAdminSubject.asObservable();

    this.userSubject = new BehaviorSubject<User | null>(user);
    this.user$ = this.userSubject.asObservable();
  }

  private checkLoginFromSession(): boolean {
    const userExists = !!sessionStorage.getItem('user');
    console.log('Session check result:', userExists);
    return userExists;
  }

  private checkAdminFromSession(): boolean {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    return userData?.role === 'admin';
  }

  setAdminStatus(isAdmin: boolean): void {
    this.isAdminSubject.next(isAdmin);

    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    sessionStorage.setItem(
      'user',
      JSON.stringify({ ...userData, role: isAdmin ? 'admin' : 'staff' })
    );
  }

  login(user: User): void {
    const isAdmin = user.role === 'admin';

    this.isAuthenticatedSubject.next(true);
    this.isAdminSubject.next(isAdmin);
    this.userSubject.next(user);

    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('isAdmin', JSON.stringify(isAdmin));
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    this.isAdminSubject.next(false);
    this.userSubject.next(null);

    sessionStorage.clear();
    this.router.navigate(['/']);

  }

  getUser(): User | null {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.getValue();
  }

  isUserAdmin(): boolean {
    return this.isAdminSubject.getValue();
  }
}

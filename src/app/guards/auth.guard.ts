import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router);          

  return authService.isAuthenticated$.pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true; // Allow access if the user is logged in
      } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false; // Redirect to login page
      }
    })
  );
};

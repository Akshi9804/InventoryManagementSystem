import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router);          

  return authService.isAdmin$.pipe(
    map((isAdmin) => {
      if (isAdmin) {
        return true; // User is an admin, allow access
      } else {
        router.navigate(['/unauthorized']); // Navigate to unauthorized page
        return false; // Block access
      }
    })
  );
};

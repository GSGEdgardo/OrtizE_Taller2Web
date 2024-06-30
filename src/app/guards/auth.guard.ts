import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * @description Guard function to protect routes based on user authentication and role.
 * @param route ActivatedRouteSnapshot The activated route snapshot.
 * @param state RouterStateSnapshot The router state snapshot.
 * @returns Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree An observable, promise, or boolean indicating if the route can be activated.
 */
export const authGuardFn: (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree = (
  route,
  state
) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const account = accountService.currentAccountValue;
  
  // console.log('Current account role ID:', account?.roleId);
  // console.log('Current account role type:', account?.roleType);
  // console.log('Current account email:', account?.email);
  // console.log('Current account token:', account?.token);

  if (account) {
    // Allow access to admin routes for users with roleId 1
    if (account.roleId === 1 && state.url.startsWith('/admin')) {
      return true;
    }
    // Allow access to user routes for users with roleId 2
    if (account.roleId === 2 && state.url.startsWith('/user')) {
      return true;
    }
    // Allow access to profile editing and password changing routes
    if (state.url.includes('/edit-profile') || state.url.includes('/change-password')) {
      return true;
    }
  }

  // Redirect to login page if not authenticated or authorized
  return router.createUrlTree(['/login']);
};

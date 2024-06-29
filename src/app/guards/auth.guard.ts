import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

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
  console.log('Current account role ID:', account?.roleId);
  console.log('Current account role type:', account?.roleType);
  console.log('Current account email:', account?.email);
  console.log('Current account token:', account?.token);

  if (account) {
    if (account.roleId === 1 && state.url.startsWith('/admin')) {
      return true;
    }
    if (account.roleId === 2 && state.url.startsWith('/user')) {
      return true;
    }
    if (state.url.includes('/edit-profile') || state.url.includes('/change-password')) {
      return true;
    }
  }

  return router.createUrlTree(['/login']);
};

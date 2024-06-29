import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProductsComponent } from './view-products/view-products.component';
import { UserProfileComponent } from '../admin/user-profile/user-profile.component';
import { ChangePasswordComponent } from '../admin/user-profile/change-password/change-password.component';
import { authGuardFn } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ViewProductsComponent, canActivate: [authGuardFn] },
  { path: 'edit-profile', component: UserProfileComponent, canActivate: [authGuardFn] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuardFn] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

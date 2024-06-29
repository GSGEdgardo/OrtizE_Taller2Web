import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ViewSalesComponent } from './view-sales/view-sales.component';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';
import { authGuardFn } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'manage-products', component: ManageProductsComponent, canActivate: [authGuardFn] },
      { path: 'manage-clients', component: ManageClientsComponent, canActivate: [authGuardFn] },
      { path: 'view-sales', component: ViewSalesComponent, canActivate: [authGuardFn] },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [authGuardFn] },
      { path: 'edit-profile', component: UserProfileComponent, canActivate: [authGuardFn] },
      { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuardFn] },
      { path: '', redirectTo: 'manage-products', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

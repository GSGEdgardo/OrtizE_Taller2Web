import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { ManageClientsComponent } from "./manage-clients/manage-clients.component";
import { ManageProductsComponent } from "./manage-products/manage-products.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ViewSalesComponent } from "./view-sales/view-sales.component";
import { ChangePasswordComponent } from "./user-profile/change-password/change-password.component";

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'manage-products', component: ManageProductsComponent },
      { path: 'manage-clients', component: ManageClientsComponent },
      { path: 'view-sales', component: ViewSalesComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'edit-profile', component: UserProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: '', redirectTo: 'manage-products', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
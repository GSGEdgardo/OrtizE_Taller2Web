import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { ViewSalesComponent } from './view-sales/view-sales.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesService } from 'src/app/services/sales.service';
import { ChangePasswordComponent } from './user-profile/change-password/change-password.component';

@NgModule({
  declarations: [
    AdminComponent,
    ManageProductsComponent,
    ManageClientsComponent,
    ViewSalesComponent,
    UserProfileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    SalesService
  ]
})
export class AdminModule { }

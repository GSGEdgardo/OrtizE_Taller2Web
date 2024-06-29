import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { ViewProductsComponent } from './view-products/view-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseModalComponent } from './purchase-modal/purchase-modal.component';
import { UserNavComponent } from './user-nav.component';


@NgModule({
  declarations: [
    ViewProductsComponent,
    PurchaseModalComponent,
    UserNavComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }

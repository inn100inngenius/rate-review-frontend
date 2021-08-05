import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { AddEditComponent } from './add-edit.component';
import { LayoutComponent } from './layout.component';
import { ViewComponent } from './view.component';


@NgModule({
  declarations: [AddEditComponent, LayoutComponent, ViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    CustomerManagementRoutingModule,
    ReactiveFormsModule
  ]
})
export class CustomerManagementModule {


 }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { ViewComponent } from './view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionComponent } from './permission/permission.component';



@NgModule({
  declarations: [
    LayoutComponent, 
    AddEditComponent,
    ViewComponent,
    PermissionComponent
  ],
  imports: [
    CommonModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule { }

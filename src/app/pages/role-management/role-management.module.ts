import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { ViewComponent } from './view.component';
import { PermissionComponent } from './permission/permission.component';
import { RoleManagementRoutingModule } from './role-management-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    LayoutComponent, 
    AddEditComponent,
    ViewComponent,
    PermissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RoleManagementRoutingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class RoleManagemmentModule { }

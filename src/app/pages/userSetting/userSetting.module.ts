import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { UserSettingRoutingModule } from './userSetting-routing.module';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { UserSettingViewComponent } from './view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionComponent } from './permission/permission.component';



@NgModule({
  declarations: [
    LayoutComponent, 
    AddEditComponent,
    UserSettingViewComponent,
    PermissionComponent
  ],
  imports: [
    CommonModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    UserSettingRoutingModule
  ]
})
export class UserSettingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { ViewComponent } from './view.component';
import { RoleManagementComponent } from './role-management.component';
import { PermissionComponent } from './permission/permission.component';
const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
        { path: '', component: RoleManagementComponent},
        { path: 'view', component: ViewComponent },
        { path: 'add', component: AddEditComponent },
        { path: 'edit/:id', component: AddEditComponent },
        { path: 'permissions/:id', component: PermissionComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleManagementRoutingModule { }

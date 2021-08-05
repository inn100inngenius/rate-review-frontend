import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { ViewComponent } from './view.component';
import { UserManagementComponent } from './user-management.component';
import { PermissionComponent } from './permission/permission.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
        { path: '', component: UserManagementComponent},
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
export class UserManagementRoutingModule { }

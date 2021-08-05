import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { UserSettingViewComponent } from './view.component';
import { UserSettingComponent } from './userSetting.component';
import { PermissionComponent } from './permission/permission.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
        { path: '', component: UserSettingComponent},
        { path: 'view', component: UserSettingViewComponent },
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
export class UserSettingRoutingModule { }

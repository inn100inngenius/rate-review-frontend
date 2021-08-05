import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { ViewComponent } from './view.component';
import { PropertyManagementComponent } from './property-management.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
        { path: '', component: PropertyManagementComponent},
        { path: 'view', component: ViewComponent },
        { path: 'add', component: AddEditComponent },
        { path: 'edit/:id', component: AddEditComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyManagementRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { ViewComponent } from './view.component';
import { ListComponent } from './list.component';
const routes: Routes = [
  {
      path: '', component: LayoutComponent,
      children: [
          { path: '', component: ListComponent},
          { path: 'view', component: ViewComponent},
          { path: 'add', component: AddEditComponent },
          { path: 'edit/:id', component: AddEditComponent }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }





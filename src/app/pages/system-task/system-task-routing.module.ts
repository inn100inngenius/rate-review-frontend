import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LayoutComponent} from './layout.component';
import {AddSystemTaskComponent} from './add-system-task/add-system-task.component';
import {ListSystemTaskComponent} from './list-system-task/list-system-task.component';
import {ViewSystemTaskComponent} from './view-system-task/view-system-task.component';


const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
        { path: '', component: ListSystemTaskComponent},
        { path: 'add', component: AddSystemTaskComponent},
        { path: 'view/:id', component: ViewSystemTaskComponent}
      ]
    }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemTaskRoutingModule { }

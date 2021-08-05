import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskManagementComponent } from './task-management.component';
import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add/add-edit.component';
import { ViewComponent } from './view/view.component';
import { TimelineComponent } from './timeline/timeline.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', component: DashboardComponent},
      { path: 'taskboard', component: TaskManagementComponent},
      { path: 'add', component: AddEditComponent},
      { path: 'view/:id', component: ViewComponent },
      { path: 'timeline/:id', component: TimelineComponent },
      { path: 'my-tasks', component: MyTasksComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskManagementRoutingModule { }

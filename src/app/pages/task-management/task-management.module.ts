import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule} from '@angular/material/sidenav';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { TaskManagementRoutingModule } from './task-management-routing.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskManagementComponent } from './task-management.component';

import { AddEditComponent } from './add/add-edit.component';
import { ViewComponent } from './view/view.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { LayoutComponent } from './layout.component';
import { TimelineComponent } from './timeline/timeline.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DataTablesModule } from 'angular-datatables';
import { NgxDropzoneModule } from 'ngx-dropzone';
// import { NgxSocialShareModule } from 'ngx-social-share';
// import { ShareButtonsPopupModule } from 'ngx-sharebuttons/popup'
import { ExportAsModule } from 'ngx-export-as';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [LayoutComponent,AddEditComponent,ViewComponent, TimelineComponent, MyTasksComponent, DashboardComponent],
  imports: [
    CommonModule,
    AngularMultiSelectModule,
    MatSidenavModule,
    DragDropModule,
    FormsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    NgbModule,
    TaskManagementRoutingModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    AngularEditorModule,
    NgMultiSelectDropDownModule,
    DataTablesModule,
    NgxDropzoneModule,
    ExportAsModule,
    ChartsModule
    // NgxSocialShareModule,
    // ShareButtonsPopupModule
  ],

  // entryComponents: [NgbdModalContent]
})
export class TaskManagementModule { }

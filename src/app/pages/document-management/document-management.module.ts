import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutComponent } from './layout.component';
import { RevisionControlComponent } from './revision-control/revision-control.component';

import { DocumentManagementRoutingModule } from './document-management-routing.module';
import { AdvanceTrackingComponent } from './advance-tracking/advance-tracking.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { TreeComponent } from '@app/_components/tree/tree.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { CheckinComponent } from './checkin/checkin.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MyApprovalsComponent } from './my-approvals/my-approvals.component';
import { MyCheckoutsComponent } from './my-checkouts/my-checkouts.component';
import { MyReviewsComponent } from './my-reviews/my-reviews.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { MyRejectedDocumentsComponent } from './my-rejected-documents/my-rejected-documents.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DocumentManagementComponent } from './document/document-management.component';
// import { DocumentSidemenuComponent } from './pages/document-management/document-sidemenu/document-sidemenu.component';
import { DocumentSidemenuComponent } from '.././document-management/document-sidemenu/document-sidemenu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { DocumentAuditComponent } from './document-audit/document-audit.component';
import { TaskDocumentsComponent } from './task-documents/task-documents.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgApexchartsModule } from "ng-apexcharts";
@NgModule({
  declarations: [
    TreeComponent,
    LayoutComponent,
    RevisionControlComponent, 
    AdvanceTrackingComponent,
    DocumentDetailsComponent,
    ViewDetailsComponent,
    TimelineComponent,
    UploadDocumentComponent,
    CheckinComponent,
    MyApprovalsComponent,
    MyCheckoutsComponent,
    MyReviewsComponent,
    MyDocumentsComponent,
    MyRejectedDocumentsComponent,
    DocumentSidemenuComponent,
    DocumentManagementComponent,
    DocumentAuditComponent,
    TaskDocumentsComponent,
    DashboardComponent
  ],
  imports: [
    TreeModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxFileDropModule,
    MatTabsModule,
    NgxDropzoneModule,
    NgMultiSelectDropDownModule,
    DocumentManagementRoutingModule,
    DataTablesModule,
    NgApexchartsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DocumentManagementModule { }

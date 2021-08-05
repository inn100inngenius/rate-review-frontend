import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DocumentManagementComponent } from './document/document-management.component';
import { RevisionControlComponent } from './revision-control/revision-control.component';
import { AdvanceTrackingComponent } from './advance-tracking/advance-tracking.component';
import { DocumentDetailsComponent } from './document-details/document-details.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { CheckinComponent } from './checkin/checkin.component';
import { MyApprovalsComponent } from './my-approvals/my-approvals.component';
import { MyCheckoutsComponent } from './my-checkouts/my-checkouts.component';
import { MyReviewsComponent } from './my-reviews/my-reviews.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { MyRejectedDocumentsComponent } from './my-rejected-documents/my-rejected-documents.component';
import { DocumentAuditComponent } from './document-audit/document-audit.component';
import { TaskDocumentsComponent } from './task-documents/task-documents.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
        { path: '', component: DocumentManagementComponent,data: { docSidemenu : true }},
        { path: 'revision-control', component: RevisionControlComponent,data: { docSidemenu : true } },
        { path: 'advance-tracking', component: AdvanceTrackingComponent,data: { docSidemenu : true } },
        { path: 'document-details/:id', component: DocumentDetailsComponent,data: { docSidemenu : false } },
        { path: 'view-details', component: ViewDetailsComponent,data: { docSidemenu : true } },
        { path: 'timeline', component: TimelineComponent,data: { docSidemenu : true } },
        { path: 'upload-document', component: UploadDocumentComponent,data: { docSidemenu : false } },
        { path: 'document-checkin/:id', component: CheckinComponent,data: { docSidemenu : true } },
        { path: 'my-approvals', component: MyApprovalsComponent,data: { docSidemenu : true } },
        { path: 'my-checkouts', component: MyCheckoutsComponent,data: { docSidemenu : true } },
        { path: 'my-reviews', component: MyReviewsComponent ,data: { docSidemenu : true }},
        { path: 'my-documents', component: MyDocumentsComponent ,data: { docSidemenu : true }},
        { path: 'my-rejected-docs', component: MyRejectedDocumentsComponent,data: { docSidemenu : true } },
        { path: 'document-audit-trails', component: DocumentAuditComponent,data: { docSidemenu : true } },
        { path: 'task-documents', component: TaskDocumentsComponent,data: { docSidemenu : true } },

      ]
    }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentManagementRoutingModule { }

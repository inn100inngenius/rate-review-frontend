import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SystemTaskRoutingModule } from './system-task-routing.module';
import { LayoutComponent } from './layout.component';
import { FormioModule } from 'angular-formio';
import { AddSystemTaskComponent } from './add-system-task/add-system-task.component';
import { ListSystemTaskComponent } from './list-system-task/list-system-task.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataTablesModule } from 'angular-datatables';
import { ViewSystemTaskComponent } from './view-system-task/view-system-task.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};
@NgModule({
  declarations: [LayoutComponent, AddSystemTaskComponent, ListSystemTaskComponent, ViewSystemTaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormioModule,
    NgbModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    DataTablesModule,
    SystemTaskRoutingModule,
    NgxDropzoneModule,
    NgWizardModule.forRoot(ngWizardConfig)
  ]
})
export class SystemTaskModule { }



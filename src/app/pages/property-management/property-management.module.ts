import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LayoutComponent } from './layout.component';
import { AddEditComponent } from './add-edit.component';
import { ViewComponent } from './view.component';

import { PropertyManagementRoutingModule } from './property-management-routing.module';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};
@NgModule({
  declarations: [
    LayoutComponent, 
    AddEditComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    PropertyManagementRoutingModule,
    NgbModule,
    NgWizardModule.forRoot(ngWizardConfig)
  ]
})
export class PropertyManagementModule { }

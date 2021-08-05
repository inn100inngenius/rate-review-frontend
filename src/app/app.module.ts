import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
// used to create fake backend
//import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent, BreadcrumbComponent, TreeComponent } from './_components';

import { HomeComponent } from './pages/home';
import { ListComponent } from './pages/customer-management/list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MaterialModule } from './_shared/index'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { HighchartsChartModule } from 'highcharts-angular';

import { PropertyManagementComponent } from './pages/property-management/property-management.component';
import { RoleManagementComponent } from './pages/role-management/role-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { UserSettingComponent } from './pages/userSetting/userSetting.component';
import { CustomerDashboardComponent } from './pages/customer-dashboard/customer-dashboard.component';
import { PropertyDashboardComponent } from './pages/property-dashboard/property-dashboard.component';;
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskManagementComponent } from './pages/task-management/task-management.component';
import { CalenderComponent } from './pages/calender/calender.component';;
import { DocumentDashboardComponent } from './pages/document-dashboard/document-dashboard.component';
import { AuditTrailComponent } from './pages/audit-trail/audit-trail.component';;
import { ViewEventComponent } from './pages/calender/view-event/view-event.component';
import { TreeModule } from '@circlon/angular-tree-component';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxDropzoneModule } from 'ngx-dropzone';

// import { DocumentSidemenuComponent } from './pages/document-management/document-sidemenu/document-sidemenu.component';
import { FormioModule } from 'angular-formio';
import { ToastComponent } from './toast/toast.component';
import { NgxSpinnerModule } from "ngx-spinner";;
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'
;
import { PriceComponent } from './pages/price/price.component'
;
import { ReviewComponent } from './pages/review/review.component'
;
import { HotelsettingComponent } from './pages/hotelsetting/hotelsetting.component'
import { DialogService } from './pages/hotelsetting/model-pop-up.service';
import { MatDialogModule } from '@angular/material/dialog';;
import { ModelpopComponent } from './pages/modelpop/modelpop.component'
;
import { RatesComponent } from './pages/rates/rates.component'
;

FullCalendarModule.registerPlugins([
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    interactionPlugin
]);
const ngWizardConfig: NgWizardConfig = {
    theme: THEME.default
};
@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        ChartsModule,
        NgbModule,
        AngularMultiSelectModule,
        NgMultiSelectDropDownModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        DragDropModule,
        FullCalendarModule,
        TreeModule,
        DataTablesModule,
        NgxFileDropModule,
        NgxDropzoneModule,
        NgWizardModule.forRoot(ngWizardConfig),
        NgxSpinnerModule,
        HighchartsChartModule,
        MatDialogModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        BreadcrumbComponent,
        HomeComponent,
        ListComponent,
        RoleManagementComponent,
        UserManagementComponent,
        UserSettingComponent,
        PropertyManagementComponent,
        PropertyDashboardComponent,
        TaskManagementComponent,
        CalenderComponent,
        DocumentDashboardComponent,
        AuditTrailComponent,
        ViewEventComponent,
        NavbarComponent,
        LoginComponent,
        //DocumentSidemenuComponent,
        ToastComponent,
        ForgotPasswordComponent,
        PriceComponent,
        ReviewComponent ,
        HotelsettingComponent ,
        ModelpopComponent ,
        RatesComponent],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        DialogService
        // provider used to create fake backend
        // fakeBackendProvider
    ],
    exports: [
        // DocumentSidemenuComponent
    ],
    bootstrap: [AppComponent],

})
export class AppModule { };
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home';
import { CustomerDashboardComponent  } from './pages/customer-dashboard/customer-dashboard.component';
import { PropertyDashboardComponent  } from './pages/property-dashboard/property-dashboard.component';
import { DocumentDashboardComponent } from './pages/document-dashboard/document-dashboard.component';
// import { DocumentManagementComponent } from './pages/document-management/document-management.component';
import { AuditTrailComponent } from './pages/audit-trail/audit-trail.component';
import { DashboardComponent } from './pages/document-management/dashboard/dashboard.component';

import { CalenderComponent  } from './pages/calender/calender.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AuthGuard } from './_helpers';
import { PriceComponent } from './pages/price/price.component';
import { ReviewComponent } from './pages/review/review.component';
import { HotelsettingComponent } from './pages/hotelsetting/hotelsetting.component';
import { RatesComponent } from './pages/rates/rates.component';


// const accountModule = () => import('./pages/account/account.module').then(x => x.AccountModule);
// const usersModule = () => import('./pages/users/users.module').then(x => x.UsersModule);
const customerModule = () => import('./pages/customer-management/customer-management.module').then(x => x.CustomerManagementModule);
const propertyManagement = () => import('./pages/property-management/property-management.module').then(x => x.PropertyManagementModule);
const roleManagement = () => import('./pages/role-management/role-management.module').then(x => x.RoleManagemmentModule);
const UserSettingModule = () => import('./pages/userSetting/userSetting.module').then(x => x.UserSettingModule);
const userManagementModule = () => import('./pages/user-management/user-management.module').then(x => x.UserManagementModule);
const taskManagementModule = () => import('./pages/task-management/task-management.module').then(x => x.TaskManagementModule);
const documentManagementModule = () => import('./pages/document-management/document-management.module').then(x => x.DocumentManagementModule);
const systemTaskModule = () => import('./pages/system-task/system-task.module').then(x => x.SystemTaskModule);


//, canActivate: [AuthGuard]
const routes: Routes = [ 
    { path: 'login', component: LoginComponent,data: { breadcrumb: '' ,nav : false, header: false }},
    { path: 'forgot-password', component: ForgotPasswordComponent,data: { breadcrumb: '' ,nav : false, header: false }},
    { path: 'home', canActivate: [AuthGuard], component: HomeComponent ,data: { breadcrumb: 'home' ,nav : false, header: true}},
    { path: 'home', canActivate: [AuthGuard], component: HomeComponent ,data: { breadcrumb: 'home' ,nav : false, header: true}},
    // { path: 'users', loadChildren: usersModule ,data: { breadcrumb: 'users' ,nav : false, header: true}},
    { path: 'customer',  canActivate: [AuthGuard],loadChildren: customerModule,data: { breadcrumb: 'customers',nav:false, header: true } },
    // { path: 'account', loadChildren: accountModule },
    { path: 'customer/dashboard',  canActivate: [AuthGuard],component: CustomerDashboardComponent,data: { breadcrumb: '' ,nav : false, header: true} },
    { path: 'property-management', canActivate: [AuthGuard], loadChildren: propertyManagement ,data: { breadcrumb: '' ,nav : false, header: true}},
    { path: 'role-management',  canActivate: [AuthGuard],loadChildren: roleManagement,data: { breadcrumb: '' ,nav : false, header: true} },
    { path: 'property/dashboard', canActivate: [AuthGuard], component: PropertyDashboardComponent },
    { path: 'user-management',  canActivate: [AuthGuard],loadChildren: userManagementModule,data: { breadcrumb: '' ,nav : false, header: true} },
    { path: 'userSetting',  canActivate: [AuthGuard],loadChildren: UserSettingModule,data: { breadcrumb: '' ,nav : false, header: true} },
    { path: 'task-management',  canActivate: [AuthGuard],loadChildren: taskManagementModule,data: { breadcrumb: '' ,nav : false, header: true} },
    { path: 'calendar',  canActivate: [AuthGuard],component: CalenderComponent,data: { breadcrumb: '' ,nav : false, header: true} },
    // { path: 'document/dashboard', component: DocumentDashboardComponent,data: { breadcrumb: '' ,nav : false, header: true} }, 
    { path: 'document/dashboard', canActivate: [AuthGuard], component: DashboardComponent,data: { breadcrumb: '' ,nav : false, header: true} }, 
    { path: 'document-management',  canActivate: [AuthGuard],loadChildren: documentManagementModule ,data: { breadcrumb: '' ,nav : false, header: true}},
    { path: 'audit-trail', canActivate: [AuthGuard], component: AuditTrailComponent,data: { breadcrumb: '' ,nav : false, header: true} },
    { path: 'system-tasks', canActivate: [AuthGuard], loadChildren: systemTaskModule,data: { breadcrumb: '' ,nav : false, header: true} },
    { path: 'price', canActivate: [AuthGuard], component: PriceComponent ,data: { breadcrumb: 'home' ,nav : false, header: true}},
    { path: 'review', canActivate: [AuthGuard], component: ReviewComponent ,data: { breadcrumb: 'home' ,nav : false, header: true}},
    { path: 'hotelSetting', canActivate: [AuthGuard], component: HotelsettingComponent ,data: { breadcrumb: 'home' ,nav : false, header: true}},
    { path: 'rates', canActivate: [AuthGuard], component: RatesComponent ,data: { breadcrumb: 'home' ,nav : false, header: true}},
    // otherwise redirect to home 
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
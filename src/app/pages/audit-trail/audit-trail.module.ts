import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditTrailComponent} from './audit-trail.component';
import { AuditTrailRoutingModule } from './audit-trail-routing.module';


@NgModule({
  declarations: [AuditTrailComponent],
  imports: [
    CommonModule,
    AuditTrailRoutingModule
  ]
})
export class AuditTrailModule { }

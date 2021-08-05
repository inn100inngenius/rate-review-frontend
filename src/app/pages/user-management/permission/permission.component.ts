import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '@app/_services';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

  constructor( private breadcrumbService: BreadcrumbService) { 
    this.setBreadcrumb();
  }

  ngOnInit(): void {
    
  }
  setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer'},
      {'page':'User Management','path':'/user-management'},
      {'page':'Permission','path':''}
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }
}

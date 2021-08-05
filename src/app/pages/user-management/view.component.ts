import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '@app/_services';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./user-management.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) { 
    this.setBreadcrumb();
  }
  setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer/dashboard'},
      {'page':'User Management','path':'/user-management'},

      {'page':'View User','path':''}
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }
  ngOnInit(): void {
  }

}

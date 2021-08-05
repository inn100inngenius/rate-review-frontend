import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '@app/_services';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./userSetting.component.css']
})
export class UserSettingViewComponent implements OnInit {

  constructor(private breadcrumbService: BreadcrumbService) { 
    this.setBreadcrumb();
  }
  setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer/dashboard'},
      {'page':'User Setting','path':'/userSetting'},

      {'page':'View User','path':''}
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }
  ngOnInit(): void {
  }

}

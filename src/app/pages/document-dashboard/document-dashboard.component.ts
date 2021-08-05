import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { BreadcrumbService } from '@app/_services';


@Component({
  selector: 'app-document-dashboard',
  templateUrl: './document-dashboard.component.html',
  styleUrls: ['./document-dashboard.component.css']
})
export class DocumentDashboardComponent implements OnInit {
  user: User;
  constructor(private accountService: AccountService,private breadcrumbService: BreadcrumbService) {
    this.user = this.accountService.userValue;
    this.setBreadcrumb();

   }
   setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer/dashboard'},
      {'page':'Document Management','path':''},

    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }
  ngOnInit(): void {
  }

}

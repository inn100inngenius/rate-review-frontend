


import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BreadcrumbService } from '@app/_services';


@Component({
  selector: 'app-property-dashboard',
  templateUrl: './property-dashboard.component.html',
  styleUrls: ['./property-dashboard.component.css']
})
export class PropertyDashboardComponent implements OnInit {

  
    user: User;
    
    public lineChartData: ChartDataSets[] = [
        { data: [51, 49, 54, 44, 51, 55, 47, 50, 48, 47, 54, 50], label: 'User 1' },
      ];
      public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    //   public lineChartOptions: (ChartOptions & { annotation: any }) = {
    //     responsive: true,
    //   };
      public lineChartColors: Color[] = [
        {
          borderColor: 'rgba(5, 191, 2, 0.5)',
          backgroundColor: 'rgba(255, 191, 2, 0)',
        },
      ];
      public lineChartLegend = true;
      public lineChartType = 'line';
      public lineChartPlugins = [];
      
      constructor(private accountService: AccountService,private breadcrumbService: BreadcrumbService) {
        this.user = this.accountService.userValue;
        this.setBreadcrumb();

    }
    setBreadcrumb(){
      let breadcrumbData = [ 
        {'page':'home','path':'/home'},
        {'page':'Customer Management','path':'/customer/dashboard'},
        {'page':'Task Management','path':''},

      ];
      this.breadcrumbService.changeMessage(breadcrumbData);
    }
    ngOnInit(): void {
    }
    
}

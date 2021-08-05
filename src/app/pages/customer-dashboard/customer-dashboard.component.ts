import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { BreadcrumbService } from '@app/_services';
import { ScriptService } from '../../_services/script.service';


@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
  providers: [ ScriptService ]

})
export class CustomerDashboardComponent implements OnInit {

  
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
      
      constructor(private accountService: AccountService,private breadcrumbService: BreadcrumbService,
        private script: ScriptService) {
        this.user = this.accountService.userValue;
        this.setBreadcrumb();
    }
    setBreadcrumb(){
      let breadcrumbData = [ 
        {'page':'home','path':'/home'},
        {'page':'Customer Management','path':'/customer'},
        {'page':'Dashboard','path':''},

      ];
      this.breadcrumbService.changeMessage(breadcrumbData);
    }
    ngOnInit(): void {
    }
    ngAfterContentInit() {
      this.script.load('customerDashboard').then(data => {
      console.log('script loaded ', data);
      }).catch(error => console.log(error));
  }
}




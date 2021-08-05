import { Component } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, BreadcrumbService, LocalStorageService } from '@app/_services';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { ScriptService } from '../../_services/script.service';
import { interval, timer } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";
//import { Chart } from 'angular-highcharts';
import * as Highcharts from "highcharts/highmaps";
//import worldMap from "highcharts/map-collection/custom/world.geo.json";
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import { AppService } from '@app/app.service';

//mapdata(Highcharts);

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.less'],
  providers: [ScriptService]
})

export class PriceComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = 'mapChart';

  chartOptions: Highcharts.Options = {
    chart: {
      map: worldMap
      // events: {
      //   load: function() {
      //     var chart = this,
      //       series = chart.series[0];
      //     console.log(series);
      //   }
      // }
    },
    title: {
      text: ''
    },
    subtitle: {
      text:
        ''
    },
    mapNavigation: {
      enabled: false,
      buttonOptions: {
        alignTo: 'spacingBox'
      }
    },
    legend: {
      enabled: false
    },
    colorAxis: {
      min: 0
    },
    plotOptions: {
      map: {
        states: {
          hover: {
            color: '#BADA55'
          },
          select: {
            color: 'red'
          }
        }
      }
    },
    series: [
      {
        type: 'map',
        name: 'Login Counts',
        allowPointSelect: true,
        dataLabels: {
          enabled: false,
          format: '{point.name}'
        },
        allAreas: true,
        data: [

          //   ['in', 5]

        ]
      }
    ],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 200
        }

      }]
    }
  };
  updateFlag = false;
  user: User;
  breadcrumbs: string[] = ['Projects', 'Angular Jira Clone', 'Kanban Board'];

 

  public BookingData = [];
  public HotelData = [];
  public ExpediaData = [];
  public HotelReview = [];
  public ExpediaReview = [];
  userCountStats: any = { customers: 0, properties: 0, users: 0, tasks: 0, documents: 0, system_tasks: 0 };
  constructor(private accountService: AccountService, private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService, private script: ScriptService,
    private http: HttpClient, public toastService: ToastService,
    private SpinnerService: NgxSpinnerService, private appService: AppService,
    private localStorageService: LocalStorageService) {
    this.user = this.accountService.userValue;
    this.setBreadcrumb();


  }
  setBreadcrumb() {
    let breadcrumbData = [{ 'page': 'home', 'path': '/home' }, { 'page': 'Home', 'path': '/home' }];
    this.breadcrumbService.changeMessage(breadcrumbData);

  }
  ngOnInit() {
    // this.getDataCountsByUser();
    // this.getUserCountByCountries();
    this.getHotelData();
  }

  ngAfterContentInit() {
  }
  getHotelData() {
    // const that = this;
    var formData = {id: this.localStorageService.getValue().userId };

    this.appService.post('Dashboard/Booking_HotelData', formData).subscribe(
      data => {
        console.log(data);
        this.BookingData = data;
      }, err => { console.log(err); })

    this.appService.post('Dashboard/Hotel_HotelData', formData).subscribe(
      data => {
        console.log(data);
        this.HotelData = data;
      }, err => { console.log(err); })

    this.appService.post('Dashboard/Expedia_HotelData', formData).subscribe(
      data => {
        console.log(data);
        this.ExpediaData = data;
      }, err => { console.log(err); })
   
    // this.appService.post('Dashboard/Hotel_HotelReview', {}).subscribe(
    //   data => {
    //     console.log(data);
    //     this.HotelReview = data;
    //   }, err => { console.log(err); })

    // this.appService.post('Dashboard/Expedia_HotelReview', {}).subscribe(
    //   data => {
    //     console.log(data);
    //     this.ExpediaReview = data;
    //   }, err => { console.log(err); })
  }

  
  mapData = [];
  
}

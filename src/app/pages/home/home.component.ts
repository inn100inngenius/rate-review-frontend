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
import mapdata from "./mapdata";
//import worldMap from "highcharts/map-collection/custom/world.geo.json";
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import { AppService } from '@app/app.service';

//mapdata(Highcharts);
@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ScriptService]
})

export class HomeComponent {
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

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['1⭐', '2⭐', '3⭐', '4⭐', '5⭐', '6⭐', '7⭐', '8⭐', '9⭐', '10⭐'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 136, 55, 40, 45, 89, 76], label: 'Booking' , fill: false},
    { data: [28, 48, 40, 19, 86, 27, 90, 75, 9, 86], label: 'Hotel' , fill: false},
    { data: [12, 56, 89, 105, 56, 145, 40, 5, 89, 46], label: 'Expedia' , fill: false}
  ];

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 4, 156, 55, 40], label: 'Series A', fill: false },
    { data: [60, 7, 80, 81, 20, 40, 30, 120, 40, 30], label: 'Series B', fill: true },
    { data: [65, 59, 0, 81, 56, 255, 40, 156, 6, 40], label: 'Series C', fill: false },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct'];
  public lineChartOptions: (ChartOptions & { annotation?: any }) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  public BookingData = [];
  public HotelData = [];
  public ExpediaData = [];
  public BookingReview = [];
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
    // var _this = this;
    // setTimeout(function(){ console.log(13);
    //   _this.script.load('custom').then(data => {
    //   console.log('script loaded ', data);
    //   }).catch(error => console.log(error));
    // },0);
  }
  getHotelData() {
    const that = this;
    // var formData = {user_id:this.localStorageService.getValue().userId,
    //   user_type:this.localStorageService.getValue().userType,
    //   customer_id:this.localStorageService.getValue().customerId,
    //   property_ids:this.localStorageService.getValue().propertyIds,
    //   filter_properties:'',
    //   filter_customers:''
    // };
    this.appService.post('Dashboard/Booking_HotelData', {}).subscribe(
      data => {
        console.log(data);
        this.BookingData = data;
      }, err => { console.log(err); })

    this.appService.post('Dashboard/Hotel_HotelData', {}).subscribe(
      data => {
        console.log(data);
        this.HotelData = data;
      }, err => { console.log(err); })

    this.appService.post('Dashboard/Expedia_HotelData', {}).subscribe(
      data => {
        console.log(data);
        this.ExpediaData = data;
      }, err => { console.log(err); })
    this.appService.post('Dashboard/Booking_HotelReview', {}).subscribe(
      data => {
        console.log(data);
        this.BookingReview = data;
      }, err => { console.log(err); })

    this.appService.post('Dashboard/Hotel_HotelReview', {}).subscribe(
      data => {
        console.log(data);
        this.HotelReview = data;
      }, err => { console.log(err); })

    this.appService.post('Dashboard/Expedia_HotelReview', {}).subscribe(
      data => {
        console.log(data);
        this.ExpediaReview = data;
      }, err => { console.log(err); })
  }

  getDataCountsByUser() {
    // var formData = {
    //   user_id: this.localStorageService.getValue().userId,
    //   user_type: this.localStorageService.getValue().userType,
    //   customer_id: this.localStorageService.getValue().customerId,
    //   property_ids: this.localStorageService.getValue().propertyIds,
    //   filter_properties: '',
    //   filter_customers: ''
    // };
    // var link = 'Dashboard/GetDataCountsByUser';
    // this.appService.post(link, formData).subscribe(
    //   data => {
    //     console.log(data);
    //     if (data.length > 0)
    //       this.userCountStats = { ...data[0] };
    //   },
    //   err => {
    //   })
  }
  mapData = [];
  getUserCountByCountries() {
    // const that = this;
    // var formData = {user_id:this.localStorageService.getValue().userId,
    //   user_type:this.localStorageService.getValue().userType,
    //   customer_id:this.localStorageService.getValue().customerId,
    //   property_ids:this.localStorageService.getValue().propertyIds,
    //   filter_properties:'',
    //   filter_customers:''
    // };
    // var link = 'Dashboard/UserCountByCountries';
    // this.appService.post(link, formData).subscribe(
    //   data => {
    //    if(data.length > 0){
    //     data.map(x=>{
    //       let code = x.country_code.toLowerCase();
    //       let count = x.login_count;
    //       this.mapData.push([code,count])
    //     })
    //     that.chartOptions.series[0]['data'] = this.mapData;
    //     that.updateFlag = true;
    //    }
    //   },
    //   err => {
    //   })
  }
}
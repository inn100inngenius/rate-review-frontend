import { Component } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, BreadcrumbService, LocalStorageService } from '@app/_services';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { ScriptService } from '../../_services/script.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as Highcharts from "highcharts/highmaps";
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import { AppService } from '@app/app.service';


@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.less'],
  providers: [ScriptService]
})
export class RatesComponent {

  updateFlag = false;
  user: User;
  

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 4, 156, 55, 40], label: 'Series A', fill: false },
    { data: [60, 7, 80, 81, 20, 40, 30, 120, 40, 30], label: 'Series B', fill: false },
    { data: [65, 59, 0, 81, 56, 255, 40, 156, 6, 40], label: 'Series C', fill: false },
  ];
  public lineChartLabels: Label[]; //= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct'];
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
    this.getHotelData();
  }

  getHotelData() {
    const that = this;
    this.appService.post('Dashboard/Booking_HotelData', {}).subscribe(
      data => {
        console.log(data);
        this.BookingData = data;
        this.lineChartLabels = this.BookingData;
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
  }
}

import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AppService } from '@app/app.service';
import { LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { DataTableDirective } from 'angular-datatables';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
 
} from "ng-apexcharts";
import { forkJoin, zip } from 'rxjs';
import { DocumentApiService } from '../document-api.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
export type lineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
interface RecentUploads {
  date: string;
  filename: string;
  author: string;
  role: string;
}
const RECENTUPLOADS: RecentUploads[] = [
  {
    date: '20 May 2019',
    filename: 'Auditing 2017-18.doc',
    author: 'John Snow',
    role : 'Manager'
  },
  {
    date: '18 May 2019',
    filename: 'Accounting.pdf',
    author: 'Bellamy Blake',
    role : 'General Manager'
  },
  {
    date: '17 May 2019',
    filename: 'Visitors diary.doc',
    author: 'Octavia Bas',
    role : 'Sales Manager'
  },
  {
    date: '16 May 2019',
    filename: 'Feedback entry.pdf',
    author: 'Michel Stark',
    role : 'Store Keeper'
  },
  {
    date: '14 May 2019',
    filename: 'Bill register.doc',
    author: 'Jame Smith',
    role : 'Manager'
  },
  {
    date: '09 May 2019',
    filename: 'Worksheet.exl',
    author: 'Jolly Smith',
    role : 'Store Manager'
  },
  {
    date: '03 May 2019',
    filename: 'Worksheet 2019-20.xml',
    author: 'Angelina',
    role : 'Excecutiive Chef'
  },
  {
    date: '03 May 2019',
    filename: 'Visitors diary.doc',
    author: 'Octavia Blake',
    role : 'Sales Manager'
  },
  {
    date: '01 May 2019',
    filename: 'Accounting 2020-21.doc',
    author: 'Chris Jordan',
    role : 'Excecutive Manager'
  }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  providers: [ScriptService]
})

export class DashboardComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions4: any = {};
  siteModal4: any = [];
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("linechart") linechart: ChartComponent;
  public lineChartOptions: Partial<lineChartOptions>;
  recentUploads = RECENTUPLOADS;
  filterData: any = { properties: [], customers: [] };
  propertyList = [];
  dropdownSettings: any = {};
  ShowFilter = true;
  selectedCustomers = [];
  customerList = [];
  dropdownSettingsCustomer: any = {};
  docStatusCount:any={uploads:0,downloads:0,folders:0,total_size:0,};
  constructor(private script: ScriptService,private appService: AppService,
     public localStorageService: LocalStorageService,private documentApiService:DocumentApiService) { 
    this.chartOptions = {
      series: [
        {
          name: "APPROVED",
          data: []
        },
        {
          name: "REVIEWED",
          data: []
        },
        {
          name: "REJECTED",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: [
         
        ]
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
    this.lineChartOptions = {
      series: [
        {
          name: "Uploads",
          data: []
        },
        {
          name: "Downloads",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: [],
        title: {
          text: ""
        }
      },
      yaxis: {
        title: {
          text: ""
        },
        min: 5,
        max: 40
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: 200,
        offsetX: 0
      }
    };
    
  }
  chartXLabel:any=[];
  ngOnInit(): void {
    for (let i = 6; i >= 0; i--) {
      let date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      let finalDate = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
      this.chartXLabel.push(formatDate(finalDate, 'MMM d', 'en-US'))
      this.chartOptions.xaxis.categories.push(formatDate(finalDate, 'MMM d', 'en-US'));
      this.lineChartOptions.xaxis.categories.push(formatDate(finalDate, 'MMM d', 'en-US'));
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'property_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    this.dropdownSettingsCustomer = {
      singleSelection: false,
      idField: 'id',
      textField: 'user_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    this.getAllCustomers();
    this.getAllPropertiesByUserId();
    this.getDocStatusCount();
    this.getMostDownloadedDocuments();
   
  }
  getAllCustomers() {
    var link = `${'Customers/GetAllCustomers'}`;
    var formData = {};
    this.appService.get(link, formData).subscribe(
      data => {
        this.customerList = data;
      },
      err => {
      }
    )
  }
  getAllPropertiesByUserId() {
    var formDta = {
      user_id: this.localStorageService.getValue().userId,
      user_type: this.localStorageService.getValue().userType,
      customer_id: this.localStorageService.getValue().customerId,
      property_ids: this.localStorageService.getValue().propertyIds
    }
    this.documentApiService.getAllProperties(formDta).subscribe(
      data => {
        this.propertyList = data;
      })
  }
  onPropertyChange(evType) {
    if (evType == 4) {
      this.filterData.properties = [];
      this.getDocStatusCount();
    }
    else if (evType == 3) {
      this.filterData.properties = this.propertyList;
      this.getDocStatusCount();    
    }
    else {
      this.getDocStatusCount();    
    }

  }
  onCustomerChange(evType) {
    if (evType == 4) {
      this.filterData.customers = [];
      this.getDocStatusCount();
    }
    else if (evType == 3) {
      this.filterData.customers = this.customerList;
      this.getDocStatusCount();    }
    else {
      this.getDocStatusCount();
    }

  }
  getDocStatusCount() {
    let filterPropIds = [];
    this.filterData.properties.map(x => {
      filterPropIds.push(x.id);
    })
    let filterCustomerIds = [];
    this.filterData.customers.map(x => {
      filterCustomerIds.push(x.id);
    })
    // let filterPropIds =[] ;
    // this.filterData.properties.map(x=>{
    //  filterPropIds.push(x.id);
    // })
    var formDta = {
      user_id: this.localStorageService.getValue().userId,
      user_type: this.localStorageService.getValue().userType,
      customer_id: this.localStorageService.getValue().customerId,
      property_ids: this.localStorageService.getValue().propertyIds,
      filter_properties: filterPropIds.toString(),
      filter_customers: filterCustomerIds.toString(),
    }
    zip(this.documentApiService.getDocumentUploadcount(formDta), this.documentApiService.getDocumentDownloadcount(formDta))
    .subscribe(([uploadCount, downloadCount]) => {
       this.plotLineChartData(uploadCount, downloadCount);
 })
 if(this.dtInstance)
 {this.reload();}
    this.documentApiService.getDocumentStatusCount(formDta).subscribe(
      data => {

        this.docStatusCount = { ...data[0] };
        if(this.docStatusCount.total_size == null){
          this.docStatusCount.total_size  = 0;
        }
        else{
          this.docStatusCount.total_size = this.humanFileSize(this.docStatusCount.total_size);

        }
      })
      let approved = [];
      let reviewed = [];
      let rejected = [];
    this.documentApiService.getDocumentStatusChartData(formDta).subscribe(
      data => {
      
       this.chartOptions.xaxis.categories.map(x=>{
        let f = 0;
         data.map(k=>{
          
          let date = formatDate(k.date, 'MMM d', 'en-US');
           if(date == x){
             f= 1;
            approved.push(k.approved);
            reviewed.push(k.reviewed);
            rejected.push(k.rejected);
           }
         })
         if(f ==0){
          approved.push(0);
          reviewed.push(0);
          rejected.push(0);
         }

       })

   
      this.chartOptions = {
        series: [
          {
            name: "APPROVED",
            data: approved
          },
          {
            name: "REVIEWED",
            data: reviewed
          },
          {
            name: "REJECTED",
            data: rejected
          }
        ],
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          type: "category",
          categories:  this.chartXLabel
        },
        legend: {
          position: "right",
          offsetY: 40
        },
        fill: {
          opacity: 1
        }
      };

     window.dispatchEvent(new Event('resize'));

      })
  }
 plotLineChartData(uploadCount, downloadCount){
   
   let uploads = [];
  this.chartXLabel.map(x=>{
    let f = 0;
    
    uploadCount.map(k=>{
      let date = formatDate(k.date, 'MMM d', 'en-US');
       if(date == x){
         f= 1;
         uploads.push(k.upload_count);
       }
     })
     if(f ==0){
      uploads.push(0);
     }
   })
   let downloads = [];
   this.chartXLabel.map(x=>{
    let f = 0;
  
    downloadCount.map(k=>{
      let date = formatDate(k.date, 'MMM d', 'en-US');
       if(date == x){
         f= 1;
         downloads.push(k.download_count);
       }
     })
     if(f ==0){
      downloads.push(0);
     }
   })
  this.lineChartOptions = {
    series: [
      {
        name: "Uploads",
        data: uploads
      },
      {
        name: "Downloads",
        data: downloads
      }
    ],
    chart: {
      height: 350,
      type: "line",
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      },
      redrawOnParentResize: true
    },
    colors: ["#77B6EA", "#545454"],
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: "smooth"
    },
    title: {
      text: "",
      align: "left"
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: this.chartXLabel,
      title: {
        text: ""
      }
    },
    yaxis: {
      title: {
        text: ""
      },
      min: 5,
      max: 40
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  };
  setTimeout(function(){   
    window.dispatchEvent(new Event('resize'));
}, 2000);
 }
  humanFileSize(size) {
    var i = Math.floor( Math.log(size) / Math.log(1024) );
    return Number(( size / Math.pow(1024, i) ).toFixed(2)) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
  }

  getMostDownloadedDocuments(){
   
      //var link = 'Roles/GetTableData';
      let filterPropIds = [];
      this.filterData.properties.map(x => {
        filterPropIds.push(x.id);
      })
      let filterCustomerIds = [];
      this.filterData.customers.map(x => {
        filterCustomerIds.push(x.id);
      })
      const that = this;
      let start;
      this.dtOptions4 = {
        pagingType: 'simple',
        pageLength: 10,
        responsive: true,
        serverSide: true,
        processing: false,
        autoWidth: true,
        lengthChange: true,
        info: false,
        ajax: (dataTablesParameters: any, callback) => {
          start = dataTablesParameters.start;
          dataTablesParameters['user_id'] = this.localStorageService.getValue().userId;
          dataTablesParameters['user_type'] = this.localStorageService.getValue().userType;
          dataTablesParameters['customer_id'] = this.localStorageService.getValue().customerId;
          dataTablesParameters['property_ids'] = this.localStorageService.getValue().propertyIds;
          dataTablesParameters['filter_properties'] = filterPropIds.toString();
          dataTablesParameters['filter_customers'] = filterCustomerIds.toString();

          that.documentApiService
            .getMostDownloadedDocuments(
              dataTablesParameters
            ).subscribe(resp => {
              that.siteModal4 = resp.data;
              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
                data: that.siteModal4
              });
            });
  
        },
        columns: [
          {
            title: "Document Name", data: null,
            render: function (data, type, row, meta) {
              return '<div><h6>' + row.document_name + '</h6></div>'
            }
          },
  
          {
            title: "Download Count", data: null,
            render: function (data, type, row, meta) {
  
              return '<div><h6 class="tx-primary">' + row.download_count +'</h6></div>';
  
  
  
            }
          },
  
        ]
      }
    
  }
  reload() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
}

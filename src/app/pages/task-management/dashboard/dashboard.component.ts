import { formatDate } from '@angular/common';
import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptService } from '@app/_services/script.service';
import { DataTableDirective } from 'angular-datatables';
import { TaskApiService } from '../task-api.service';
import { ChartType, ChartDataSets, ChartOptions } from 'chart.js';
import { SingleDataSet, Color, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { LocalStorageService } from '@app/_services';
import { AppService } from '@app/app.service';

 const $ :any = jQuery;
interface HighTasks {
  date: string;
  taskname: string;
  author: string;
  role: string;
  status: number;
}
const HIGHTASKS: HighTasks[] = [];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  providers: [ScriptService]
})
export class DashboardComponent implements OnInit {
  highTasks = HIGHTASKS
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;

  dtOptions: any = {};
  dtOptions1: any = {};
  dtOptions2: any = {};
  dtOptions3: any = {};
  dtOptions4: any = {};

  siteModal: any = [];
  siteModal1: any = [];
  siteModal2: any = [];
  siteModal3: any = [];
  siteModal4: any = [];
  active = 1;
  listenerFn: () => void;
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        display: false
      }],
      xAxes: [{
        ticks: {
          fontSize: 10
        }
      }]
    },
    legend: {
      display: false
    }
  };

  public barChartLabels: Label[] = [];


  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public barChartDataApprove: ChartDataSets[] = [{ data: [], label: 'Approved' }];
  public barChartDataReview: ChartDataSets[] = [{ data: [], label: 'Reviewed' }];
  public barChartDataReject: ChartDataSets[] = [{ data: [], label: 'Rejected' }];
  public barChartDataSystemTask: ChartDataSets[] = [{ data: [], label: 'System Task' }];

  public barChartColorsReview: Color[] = [
    {
      borderColor: '#61bd4f',
      backgroundColor: '#61bd4f',
    },
  ];
  public barChartColorsRejected: Color[] = [
    {
      borderColor: '#eb5a46',
      backgroundColor: '#eb5a46',
    },
  ];
  public barChartColorsSystemTask: Color[] = [
    {
      borderColor: '#3366ff',
      backgroundColor: '#3366ff',
    },
  ];
  public barChartColorsApprove: Color[] = [
    {
      borderColor: '#f2d600',
      backgroundColor: '#f2d600',
    },
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },

  };
  public pieChartLabels: Label[] = ['ToDo', 'In Progress', 'Completed', 'Not Completed'];
  public pieChartData: SingleDataSet = [0, 0, 0, 0];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public colors = [{ backgroundColor: ["#0040ff", "#ff9f1a", "#0079bf", "#eb5a46"] }];

  filterData: any = { properties: [], customers: [] };
  ShowFilter = true;
  selectedProperties = [];
  propertyList = [];
  dropdownSettings: any = {};

  selectedCustomers = [];
  customerList = [];
  dropdownSettingsCustomer: any = {};
  taskStatusCount: any = {};
  taskChartData = [];
  approvedCount = 0;
  reviewedCount = 0;
  rejectedCount = 0;
  systemTaskCount = 0;
  userStatusList = [];
  constructor(
    private script: ScriptService,
    private router: Router,
    private renderer: Renderer2,
    private taskApiService: TaskApiService,
    public localStorageService: LocalStorageService,
    private appService: AppService) {
    // this.script.load('customTaskDashboard').then(data => {
    //   console.log('script loaded ', data);     
    // }).catch(error => console.log(error));
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  reportWindowSize(){

      $($.fn.dataTable.tables(true)).DataTable()
         .columns.adjust()
         .responsive.recalc();

  }
  ngOnInit(): void {
  
    window.addEventListener('resize', this.reportWindowSize);
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      $($.fn.dataTable.tables(true)).DataTable()
         .columns.adjust()
         .responsive.recalc();
  }); 
    for (let i = 6; i >= 0; i--) {
      let date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      let finalDate = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();

      this.barChartLabels.push(formatDate(finalDate, 'MMM d', 'en-US'));

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
    this.getTableData();
    this.getMyApprovals();
    this.getMyReviews();
    this.getAllPropertiesByUserId();
    this.getAllCustomers();
    this.getTaskStatusCount();
    this.getUserStatusByTasks();
  }
  getTaskStatusCount() {
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
    this.taskApiService.getTaskStatusCount(formDta).subscribe(
      data => {

        console.log(data);
        this.taskStatusCount = { ...data[0] };
        console.log(this.taskStatusCount);
        this.taskStatusCount.todoPer = this.taskStatusCount.todo == 0 ? 0 : ((this.taskStatusCount.todo / this.taskStatusCount.total) * 100).toFixed(2);
        this.taskStatusCount.inprogressPer = this.taskStatusCount.inprogress == 0 ? 0 : ((this.taskStatusCount.inprogress / this.taskStatusCount.total) * 100).toFixed(2);
        this.taskStatusCount.completedPer = this.taskStatusCount.completed == 0 ? 0 : ((this.taskStatusCount.completed / this.taskStatusCount.total) * 100).toFixed(2);
        this.taskStatusCount.notcompletedPer = this.taskStatusCount.notcompleted == 0 ? 0 : ((this.taskStatusCount.notcompleted / this.taskStatusCount.total) * 100).toFixed(2);
        this.pieChartData = [this.taskStatusCount.todo, this.taskStatusCount.inprogress,
        this.taskStatusCount.completed, this.taskStatusCount.notcompleted]
        //this.propertyList = data;
      })

    this.taskApiService.getTaskChartData(formDta).subscribe(
      data => {
        console.log(data);
        this.approvedCount = 0;
        this.reviewedCount = 0;
        this.rejectedCount = 0;
        this.systemTaskCount = 0;
        this.barChartDataApprove[0].data = [];
        this.barChartDataReview[0].data = [];
        this.barChartDataReject[0].data = [];
        this.barChartDataSystemTask[0].data = [];
        if (data.length > 0) {
          this.taskChartData = data;
          this.taskChartData.map(x => {
            // this.barChartLabels.push( formatDate(x.date, 'M-d-y', 'en-US'));
            let isDateExists = this.barChartLabels.indexOf(formatDate(x.date, 'MMM d', 'en-US'));
            if (isDateExists > -1) {
              this.barChartDataApprove[0].data[isDateExists] = x.approved;
              this.barChartDataReview[0].data[isDateExists] = x.reviewed;
              this.barChartDataReject[0].data[isDateExists] = x.rejected;
              this.barChartDataSystemTask[0].data[isDateExists] = x.systemtasks;
            }

            this.approvedCount = this.approvedCount + x.approved;
            this.reviewedCount = this.reviewedCount + x.reviewed;
            this.rejectedCount = this.rejectedCount + x.rejected;
            this.systemTaskCount = this.systemTaskCount + x.systemtasks;

          })
        }
        // this.barChartDataApprove = data;
        // this.barChartLabels = 
      })
  }
  getAllCustomers() {
    var link = `${'Customers/GetAllCustomers'}`;
    var formData = {};
    this.appService.get(link, formData).subscribe(
      data => {
        this.customerList = data;
        console.log(data);
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
    this.taskApiService.getAllProperties(formDta).subscribe(
      data => {
        console.log(data);
        this.propertyList = data;
      })
  }
  onPropertyChange(evType) {
    if (evType == 4) {
      this.filterData.properties = [];
      this.getTaskStatusCount();
    }
    else if (evType == 3) {
      this.filterData.properties = this.propertyList;
      this.getTaskStatusCount();
    }
    else {
      this.getTaskStatusCount();
    }

  }
  onCustomerChange(evType) {
    if (evType == 4) {
      this.filterData.customers = [];
      this.getTaskStatusCount();

    }
    else if (evType == 3) {
      this.filterData.customers = this.customerList;
      this.getTaskStatusCount();
    }
    else {
      this.getTaskStatusCount();
    }

  }
  getTableData() {
    var link = 'Roles/GetTableData';

    const that = this;
    let start;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      serverSide: true,
      processing: false,
      autoWidth: true,
      info: false,
      ajax: (dataTablesParameters: any, callback) => {
        start = dataTablesParameters.start;
        dataTablesParameters['created_by'] = localStorage.getItem('userId');
        that.taskApiService
          .getMyTasks(
            dataTablesParameters
          ).subscribe(resp => {
            that.siteModal = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: that.siteModal
            });
          });

      },
      columns: [{
        title: "no", data: null,
        render: function (data, type, row, meta) {
          return start + meta.row + 1;
        }
      },
      { title: "Task title", data: 'task_title' },
      //   {title:"Assigned users",
      //   data:null,
      //   render: function (data, type, row, meta) {
      //     let htm = '';
      //     let count:any;

      //     if(row.task_users != null)
      //   {
      //     row.task_users = Array.isArray(row.task_users)?row.task_users:JSON.parse(row.task_users);
      //      count =   row.task_users.length > 3 ? 3:row.task_users.length;
      //     htm += '<div class="image-grouped" (click)="gotoTimeline(1)">';
      //     for(let i=0;i<count;i++){
      //       htm += '<img src="assets/img/faces/face4.jpg" alt="profile image">';
      //     }
      //     if(count > 3 ){
      //       htm += '<span class="more-user">';+Math.abs( parseInt(count) - 3)+'</span>';
      //     }
      //     htm += '</div>';

      //     return htm;


      //    }else{
      //     return htm;
      //    }
      //   }

      // },
      {
        title: "start date", data: null,
        render: function (data, type, row, meta) {
          return formatDate(row.start_date, 'dd MMM y', 'en-US')


        }
      },
      {
        title: "due date", data: null,
        render: function (data, type, row, meta) {
          return formatDate(row.due_date, 'dd MMM y', 'en-US')


        }
      },
      // {title:"priority",
      // data:null,
      // render: function (data, type, row, meta) {
      //   if(row.priority == 1)
      //   {
      //     return '<button class="badge badge-danger btn-dynamic  tx-12 wd-103"><i class="fa fa-arrow-up"></i>&nbsp; High</button>';
      //   }
      //   else if(row.priority == 2){
      //     return '<button class="badge badge-warning btn-dynamic  tx-12 wd-103"><i class="fa fa-sort"></i>&nbsp; Medium</button>';
      //   }
      //   else if(row.priority == 3){
      //     return '<button class="badge badge-success btn-dynamic wd-103 tx-12"><i class="fa fa-arrow-down"></i>&nbsp; Low</button>';
      //   }
      //   else{
      //     return '';
      //   }
      // }},
      {
        title: "status",
        data: null,
        render: function (data, type, row, meta) {
          row['days_to_due'] = that.calculateDiff(row.due_date);
          row.task_status = row['days_to_due'] < 0 ? 3 : row.task_status;

          if (row.task_status == 0) {
            return '<button class="badge badge-info btn-dynamic  tx-12 wd-126">Todo</button>';
          }
          else if (row.task_status == 1) {
            return '<button class="badge badge-primary btn-dynamic  wd-126 tx-12">Inprogress</button>';
          }
          else if (row.task_status == 2) {
            return '<button class="badge badge-info btn-dynamic  tx-12 wd-126 tx-12"> completed</button>';
          }
          else if (row.task_status == 3) {
            return '<button class="badge badge-danger btn-dynamic  tx-12 wd-126 tx-12">Not completed</button>';
          }


        }
      },
      {
        title: "action",
        data: null,
        render: function (data, type, row, meta) {
          return '<button data-edit-id="' + row.id + '" class="badge badge-primary btn-dynamic tx-12 wd-126 tx-12"> View </button>'
          //  return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
        }
      }]
    };
  }

  getMyApprovals() {
    //var link = 'Roles/GetTableData';

    const that = this;
    let start;
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      serverSide: true,
      processing: false,
      autoWidth: true,
      info: false,
      ajax: (dataTablesParameters: any, callback) => {
        start = dataTablesParameters.start;
        dataTablesParameters['created_by'] = localStorage.getItem('userId');
        that.taskApiService
          .getMyApprovals(
            dataTablesParameters
          ).subscribe(resp => {
            that.siteModal1 = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: that.siteModal1
            });
          });

      },
      columns: [{
        title: "no", data: null,
        render: function (data, type, row, meta) {
          return start + meta.row + 1;
        }
      },
      { title: "Task title", data: 'task_title' },
      //   {title:"Assigned users",
      //   data:null,
      //   render: function (data, type, row, meta) {
      //     let htm = '';
      //     let count:any;

      //     if(row.task_users != null)
      //   {
      //     row.task_users = Array.isArray(row.task_users)?row.task_users:JSON.parse(row.task_users);
      //      count =   row.task_users.length > 3 ? 3:row.task_users.length;
      //     htm += '<div class="image-grouped" (click)="gotoTimeline(1)">';
      //     for(let i=0;i<count;i++){
      //       htm += '<img src="assets/img/faces/face4.jpg" alt="profile image">';
      //     }
      //     if(count > 3 ){
      //       htm += '<span class="more-user">';+Math.abs( parseInt(count) - 3)+'</span>';
      //     }
      //     htm += '</div>';

      //     return htm;


      //    }else{
      //     return htm;
      //    }
      //   }

      // },
      {
        title: "start date", data: null,
        render: function (data, type, row, meta) {
          return formatDate(row.start_date, 'dd MMM y', 'en-US')


        }
      },
      {
        title: "due date", data: null,
        render: function (data, type, row, meta) {
          return formatDate(row.due_date, 'dd MMM y', 'en-US')


        }
      },
      // {title:"priority",
      // data:null,
      // render: function (data, type, row, meta) {
      //   if(row.priority == 1)
      //   {
      //     return '<button class="badge badge-danger btn-dynamic  tx-12 wd-103"><i class="fa fa-arrow-up"></i>&nbsp; High</button>';
      //   }
      //   else if(row.priority == 2){
      //     return '<button class="badge badge-warning btn-dynamic  tx-12 wd-103"><i class="fa fa-sort"></i>&nbsp; Medium</button>';
      //   }
      //   else if(row.priority == 3){
      //     return '<button class="badge badge-success btn-dynamic wd-103 tx-12"><i class="fa fa-arrow-down"></i>&nbsp; Low</button>';
      //   }
      //   else{
      //     return '';
      //   }

      // }},
      {
        title: "status",
        data: null,
        render: function (data, type, row, meta) {
          row['days_to_due'] = that.calculateDiff(row.due_date);
          row.task_status = row['days_to_due'] < 0 ? 3 : row.task_status;

          if (row.task_status == 0) {
            return '<button class="badge badge-info btn-dynamic  tx-12 wd-126">Todo</button>';
          }
          else if (row.task_status == 1) {
            return '<button class="badge badge-primary btn-dynamic  wd-126 tx-12">Inprogress</button>';
          }
          else if (row.task_status == 2) {
            return '<button class="badge badge-info btn-dynamic  tx-12 wd-126 tx-12"> completed</button>';
          }
          else if (row.task_status == 3) {
            return '<button class="badge badge-danger btn-dynamic tx-12 wd-126 tx-12">Not completed</button>';
          }


        }
      },
      {
        title: "action",
        data: null,
        render: function (data, type, row, meta) {
          return '<button data-edit-id="' + row.id + '" class="badge badge-primary btn-dynamic tx-12 wd-126 tx-12"> View </button>'

          //  return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
        }
      }]
    };
  }
  getMyReviews() {
    //var link = 'Roles/GetTableData';

    const that = this;
    let start;
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      serverSide: true,
      processing: false,
      autoWidth: true,
      info: false,
      ajax: (dataTablesParameters: any, callback) => {
        start = dataTablesParameters.start;
        dataTablesParameters['created_by'] = localStorage.getItem('userId');
        that.taskApiService
          .getMyReviews(
            dataTablesParameters
          ).subscribe(resp => {
            that.siteModal2 = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: that.siteModal2
            });
          });

      },
      columns: [{
        title: "no", data: null,
        render: function (data, type, row, meta) {
          return start + meta.row + 1;
        }
      },
      { title: "Task title", data: 'task_title' },
      //   {title:"Assigned users",
      //   data:null,
      //   render: function (data, type, row, meta) {
      //     let htm = '';
      //     let count:any;

      //     if(row.task_users != null)
      //   {
      //     row.task_users = Array.isArray(row.task_users)?row.task_users:JSON.parse(row.task_users);
      //      count =   row.task_users.length > 3 ? 3:row.task_users.length;
      //     htm += '<div class="image-grouped" (click)="gotoTimeline(1)">';
      //     for(let i=0;i<count;i++){
      //       htm += '<img src="assets/img/faces/face4.jpg" alt="profile image">';
      //     }
      //     if(count > 3 ){
      //       htm += '<span class="more-user">';+Math.abs( parseInt(count) - 3)+'</span>';
      //     }
      //     htm += '</div>';

      //     return htm;


      //    }else{
      //     return htm;
      //    }
      //   }

      // },
      {
        title: "start date", data: null,
        render: function (data, type, row, meta) {
          return formatDate(row.start_date, 'dd MMM y', 'en-US')


        }
      },
      {
        title: "due date", data: null,
        render: function (data, type, row, meta) {
          return formatDate(row.due_date, 'dd MMM y', 'en-US')


        }
      },
      // {title:"priority",
      // data:null,
      // render: function (data, type, row, meta) {
      //   if(row.priority == 1)
      //   {
      //     return '<button class="badge badge-danger btn-dynamic  tx-12 wd-103"><i class="fa fa-arrow-up"></i>&nbsp; High</button>';
      //   }
      //   else if(row.priority == 2){
      //     return '<button class="badge badge-warning btn-dynamic  tx-12 wd-103"><i class="fa fa-sort"></i>&nbsp; Medium</button>';
      //   }
      //   else if(row.priority == 3){
      //     return '<button class="badge badge-success btn-dynamic  wd-103 tx-12"><i class="fa fa-arrow-down"></i>&nbsp; Low</button>';
      //   }
      //   else{
      //     return '';
      //   }

      // }},
      {
        title: "status",
        data: null,
        render: function (data, type, row, meta) {
          row['days_to_due'] = that.calculateDiff(row.due_date);
          row.task_status = row['days_to_due'] < 0 ? 3 : row.task_status;

          if (row.task_status == 0) {
            return '<button class="badge badge-info btn-dynamic  tx-12 wd-126">Todo</button>';
          }
          else if (row.task_status == 1) {
            return '<button class="badge badge-primary btn-dynamic  wd-126 tx-12">Inprogress</button>';
          }
          else if (row.task_status == 2) {
            return '<button class="badge badge-info btn-dynamic  tx-12 wd-126 tx-12"> completed</button>';
          }
          else if (row.task_status == 3) {
            return '<button class="badge badge-danger btn-dynamic  tx-12 wd-126 tx-12">Not completed</button>';
          }


        }
      },
      {
        title: "action",
        data: null,
        render: function (data, type, row, meta) {
          return '<button data-edit-id="' + row.id + '" class="badge badge-primary btn-dynamic tx-12 wd-126 tx-12"> View </button>'

          //  return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
        }
      }]
    };
  }


  calculateDiff(sentDate) {
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  ngAfterViewInit(): void {
    this.listenerFn = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("data-edit-id")) {
        this.router.navigate(["task-management/view/" + event.target.getAttribute("data-edit-id")]);
      }
      // if (event.target.hasAttribute("data-delete-id")) {
      //   this.onDelete(event.target.getAttribute("data-delete-id"))
      // }
    });
  }

  userstate: boolean;
  urlFragment: string;
  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  gotoTimeline(val) {
    this.userstate = val == 0 ? false : true;
    this.urlFragment = val == 0 ? "timeline" : "multitimelines";
    this.router.navigate(['/task-management/timeline'], { queryParams: { multi: this.userstate }, fragment: this.urlFragment });
  }
  // getUserStatusByTasks() {
  //   var formDta = {user_id:this.localStorageService.getValue().userId,
  //    user_type:this.localStorageService.getValue().userType,
  //    customer_id:this.localStorageService.getValue().customerId,
  //    property_ids:this.localStorageService.getValue().propertyIds}
  //   this.taskApiService.getUserStatusByTasks(formDta).subscribe(
  //    data => {
  //      console.log(data);
  //      this.userStatusList = data;
  //    })
  // }

  getUserStatusByTasks() {
    //var link = 'Roles/GetTableData';

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
        that.taskApiService
          .getUserStatusByTasks(
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
          title: "User Name", data: null,
          render: function (data, type, row, meta) {
            return '<div><h6>' + row.user_name + '</h6><span> Todo / Inprogress / Completed </span> </div>'
          }
        },

        {
          title: "Task Count", data: null,
          render: function (data, type, row, meta) {

            return '<div><h6 class="tx-primary">' + row.all_tasks +
              '</h6><span> ' + row.todo + ' / ' + row.inprogress + ' / ' + row.completed + ' </span></div>';



          }
        },

      ]
    };
  }

}

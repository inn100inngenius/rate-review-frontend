import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { DataTableDirective } from 'angular-datatables';
import { TaskApiService } from '../task-api.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
 dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  //@ViewChild('datatable1') table1: ElementRef;
  
  //dataTable1: any;
  dtOptions: any = {};
  dtOptions1: any = {};
  dtOptions2: any = {};
  // siteModal: SiteModal[];
  // dataTablesResponse: DataTablesResponse[];
 // datatable1: any;
 siteModal: any=[];
  siteModal1: any=[];
  siteModal2: any=[];
  active = 1;
  listenerFn: () => void;
  constructor(private router: Router,private appService:AppService,private renderer: Renderer2,
    private taskApiService:TaskApiService) { }

  ngOnInit(): void {
    this.getTableData();
   this.getMyApprovals();
   this.getMyReviews();
    
  }
  getTableData(){
    var link = 'Roles/GetTableData';

    const that = this;
    let start;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      serverSide: true,
      processing: true,
      autoWidth:true,
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
      columns: [{ title:"no",data: null,
      render: function (data, type, row, meta) {
        return start + meta.row +1;
      } },
      {title:"Task title",data:'task_title'},
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
      {title:"due date",data:null,
    render: function (data, type, row, meta) {
     return formatDate(row.due_date, 'dd MMM y', 'en-US')
     
       
    }
  },
      {title:"priority",
      data:null,
      render: function (data, type, row, meta) {
        if(row.priority == 1)
        {
          return '<button class="badge badge-danger btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-arrow-up"></i>&nbsp; High</button>';
        }
        else if(row.priority == 2){
          return '<button class="badge badge-warning btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-sort"></i>&nbsp; Medium</button>';
        }
        else if(row.priority == 3){
          return '<button class="badge badge-success btn-dynamic mt-2 wd-103 tx-12"><i class="fa fa-arrow-down"></i>&nbsp; Low</button>';
        }
        else{
          return '';
        }
      }},
      {title:"status",
      data:null,
      render: function (data, type, row, meta) {
        row['days_to_due'] = that.calculateDiff(row.due_date);
        row.task_status = row['days_to_due'] < 0 ? 3:row.task_status;

        if(row.task_status == 0)
        {
          return '<button class="badge badge-info btn-dynamic mt-2 tx-12 wd-126">Todo</button>';
        }
        else if(row.task_status == 1){
          return '<button class="badge badge-primary btn-dynamic mt-2 wd-126 tx-12">Inprogress</button>';
        }
        else if(row.task_status == 2){
          return '<button class="badge badge-info btn-dynamic mt-2 tx-12 wd-126 tx-12"> completed</button>';
        }
        else if(row.task_status == 3){
          return '<button class="badge badge-danger btn-dynamic mt-2 tx-12 wd-126 tx-12">Not completed</button>';
        }
        
         
      }},
      {title:"action",
      data:null,
      render: function (data, type, row, meta) {
        
         return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
      }}]
    };
  }

  getMyApprovals(){
    //var link = 'Roles/GetTableData';

    const that = this;
    let start;
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      serverSide: true,
      processing: true,
      autoWidth:true,
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
      columns: [{ title:"no",data: null,
      render: function (data, type, row, meta) {
        return start + meta.row +1;
      } },
      {title:"Task title",data:'task_title'},
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
      {title:"due date",data:null,
    render: function (data, type, row, meta) {
     return formatDate(row.due_date, 'dd MMM y', 'en-US')
     
       
    }
  },
      {title:"priority",
      data:null,
      render: function (data, type, row, meta) {
        if(row.priority == 1)
        {
          return '<button class="badge badge-danger btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-arrow-up"></i>&nbsp; High</button>';
        }
        else if(row.priority == 2){
          return '<button class="badge badge-warning btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-sort"></i>&nbsp; Medium</button>';
        }
        else if(row.priority == 3){
          return '<button class="badge badge-success btn-dynamic mt-2 wd-103 tx-12"><i class="fa fa-arrow-down"></i>&nbsp; Low</button>';
        }
        else{
          return '';
        }
         
      }},
      {title:"status",
      data:null,
      render: function (data, type, row, meta) {
        row['days_to_due'] = that.calculateDiff(row.due_date);
        row.task_status = row['days_to_due'] < 0 ? 3:row.task_status;

        if(row.task_status == 0)
        {
          return '<button class="badge badge-info btn-dynamic mt-2 tx-12 wd-126">Todo</button>';
        }
        else if(row.task_status == 1){
          return '<button class="badge badge-primary btn-dynamic mt-2 wd-126 tx-12">Inprogress</button>';
        }
        else if(row.task_status == 2){
          return '<button class="badge badge-info btn-dynamic mt-2 tx-12 wd-126 tx-12"> completed</button>';
        }
        else if(row.task_status == 3){
          return '<button class="badge badge-danger btn-dynamic mt-2 tx-12 wd-126 tx-12">Not completed</button>';
        }
        
         
      }},
      {title:"action",
      data:null,
      render: function (data, type, row, meta) {
        return '<button type="button" data-edit-id="'+row.id+'" class="badge badge-primary btn-dynamic mt-2 tx-12 wd-126 tx-12">Not completed</button>'
        //  return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
      }}]
    };
  }
  getMyReviews(){
    //var link = 'Roles/GetTableData';

    const that = this;
    let start;
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      serverSide: true,
      processing: true,
      autoWidth:true,
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
      columns: [{ title:"no",data: null,
      render: function (data, type, row, meta) {
        return start + meta.row +1;
      } },
      {title:"Task title",data:'task_title'},
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
      {title:"due date",data:null,
    render: function (data, type, row, meta) {
     return formatDate(row.due_date, 'dd MMM y', 'en-US')
     
       
    }
  },
      {title:"priority",
      data:null,
      render: function (data, type, row, meta) {
        if(row.priority == 1)
        {
          return '<button class="badge badge-danger btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-arrow-up"></i>&nbsp; High</button>';
        }
        else if(row.priority == 2){
          return '<button class="badge badge-warning btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-sort"></i>&nbsp; Medium</button>';
        }
        else if(row.priority == 3){
          return '<button class="badge badge-success btn-dynamic mt-2 wd-103 tx-12"><i class="fa fa-arrow-down"></i>&nbsp; Low</button>';
        }
        else{
          return '';
        }
         
      }},
      {title:"status",
      data:null,
      render: function (data, type, row, meta) {
        row['days_to_due'] = that.calculateDiff(row.due_date);
        row.task_status = row['days_to_due'] < 0 ? 3:row.task_status;

        if(row.task_status == 0)
        {
          return '<button class="badge badge-info btn-dynamic mt-2 tx-12 wd-126">Todo</button>';
        }
        else if(row.task_status == 1){
          return '<button class="badge badge-primary btn-dynamic mt-2 wd-126 tx-12">Inprogress</button>';
        }
        else if(row.task_status == 2){
          return '<button class="badge badge-info btn-dynamic mt-2 tx-12 wd-126 tx-12"> completed</button>';
        }
        else if(row.task_status == 3){
          return '<button class="badge badge-danger btn-dynamic mt-2 tx-12 wd-126 tx-12">Not completed</button>';
        }
        
         
      }},
      {title:"action",
      data:null,
      render: function (data, type, row, meta) {
        
         return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
      }}]
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

  // Create Task
  createTask(){
    this.router.navigate(['/task-management/add']);
  }
  // Navigate Task details
  taskDetails(data){
    this.router.navigate(['/task-management/view/'+data]);
  }
}

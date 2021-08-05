import { Component, ElementRef, OnInit, ViewChild,Renderer2  } from '@angular/core';
import { AppService } from '@app/app.service';
import { BreadcrumbService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';

import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { SystemTaskApiService } from '../system-task-api-service';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-list-system-task',
  templateUrl: './list-system-task.component.html',
  styleUrls: ['./list-system-task.component.less'],
  providers:[ScriptService]
})




export class ListSystemTaskComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  @ViewChild('datatable') table: ElementRef;
  dataTable: any;
  dtOptions: any = {};
  // siteModal: SiteModal[];
  // dataTablesResponse: DataTablesResponse[];
  datatable: any;
  siteModal: any=[];
  
  roles = [];
  listenerFn: () => void;

  dropdownListCustomers =[];
  dropdownListProperties =[];
  selectedItemsCustomers = [];
  selectedItemsProperties = [];
  customerSettings = {};
  propertySettings = {};

  constructor(private breadcrumbService: BreadcrumbService,
    private appService:AppService,private renderer: Renderer2, private router: Router,
    private systemTaskApiService:SystemTaskApiService) {
   
    this.setBreadcrumb();
    
   }
   setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer/dashboard'},
      {'page':'Role Management','path':''},
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
    
    
  }
  ngOnInit(): void {
    this.getTableData();
    this.getAllCustomers();
    this.dropdownListCustomers = [
     
    ];
    this.selectedItemsCustomers = [ ];
    this.customerSettings = { 
      labelKey:"user_name",
      primaryKey:"id", 
      singleSelection: false, 
      text:"Select Customers",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class"
    };  

    this.dropdownListProperties = [
      {"id":1,"itemName":"Property 1"},
      {"id":2,"itemName":"Property 2"},
      {"id":3,"itemName":"Property 3"},
      {"id":4,"itemName":"Property 4"},
      {"id":5,"itemName":"Property 5"},
      {"id":6,"itemName":"Property 6"},   
    ];
    this.selectedItemsProperties = [ ];
    this.propertySettings = {  
      singleSelection: false, 
      text:"Select Properties",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: true,
      classes:"myclass custom-class"
    };  

  }
    
  ngAfterViewInit(): void {
    this.listenerFn = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("data-edit-id")) {
        this.router.navigate(["system-tasks/edit/" + event.target.getAttribute("data-edit-id")]);
      }
      if (event.target.hasAttribute("data-view-id")) {
        this.router.navigate(["system-tasks/view/" + event.target.getAttribute("data-view-id")]);
      }
      if (event.target.hasAttribute("data-delete-id")) {
        this.onDelete(event.target.getAttribute("data-delete-id"))
      }
    });
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
      processing: false,
      autoWidth:true,
      ajax: (dataTablesParameters: any, callback) => {
        start = dataTablesParameters.start;
        dataTablesParameters['created_by'] = localStorage.getItem('userId');
        that.systemTaskApiService
          .getMySystemTasks(
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
      {title:"Assigned users",
      data:null,
      render: function (data, type, row, meta) {
        let htm = '';
        let count:any;
        if(row.task_users != null)
      {
        row.task_users = Array.isArray(row.task_users)?row.task_users:JSON.parse(row.task_users);
        count =   row.task_users.length ;
        for(let i=0;i<count;i++){
          htm += row.task_users[i].user_name +',';
        }
        // row.task_users = Array.isArray(row.task_users)?row.task_users:JSON.parse(row.task_users);
        //  count =   row.task_users.length > 3 ? 3:row.task_users.length;
        // htm += '<div class="image-grouped" (click)="gotoTimeline(1)">';
        // for(let i=0;i<count;i++){
        //   htm += '<img src="assets/img/faces/face4.jpg" alt="profile image">';
        // }
        // if(count > 3 ){
        //   htm += '<span class="more-user">';+Math.abs( parseInt(count) - 3)+'</span>';
        // }
        // htm += '</div>';
      
        return htm.slice(0, -1);
       
          
       }else{
        return htm.slice(0, -1);
       }
      }
          
    },
      {title:"due date",data:null,
    render: function (data, type, row, meta) {
     return formatDate(row.due_date, 'dd MMM y', 'en-US')
     
       
    }
  },
      // {title:"priority",
      // data:null,
      // render: function (data, type, row, meta) {
      //   if(row.priority == 1)
      //   {
      //     return '<button class="badge badge-danger btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-arrow-up"></i>&nbsp; High</button>';
      //   }
      //   else if(row.priority == 2){
      //     return '<button class="badge badge-warning btn-dynamic mt-2 tx-12 wd-103"><i class="fa fa-sort"></i>&nbsp; Medium</button>';
      //   }
      //   else if(row.priority == 3){
      //     return '<button class="badge badge-success btn-dynamic mt-2 wd-103 tx-12"><i class="fa fa-arrow-down"></i>&nbsp; Low</button>';
      //   }
      //   else{
      //     return '';
      //   }
      // }},
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
        return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-view-id="'+row.id+'">';
// </a><a role="button" class="far fa-edit  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>
        //  return '<a role="button" class="far fa-eye  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
      }}]
    };
    
  }
  
  calculateDiff(sentDate) {
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Delete 
  onDelete(id) {
    const that = this;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
      
      var link = `${'Roles/' + id}`;
      var formData = {};
      // that.appService.delete(link,formData).subscribe(
      //   data => {
       
      //       that.reload();
      //       Swal.fire(
      //         'Deleted!',
      //         'Your record has been deleted.',
      //         'success'
      //       )
      //     }
         
      //   )
      }
    })
  }
  reload() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }

  // Multiselect
  onItemSelect(item:any){
    console.log(item);
    console.log(this.selectedItemsCustomers);
  }
  OnItemDeSelect(item:any){
    console.log(item);
    console.log(this.selectedItemsCustomers);
  }
  onSelectAll(items: any){
    console.log(items);
  }
  onDeSelectAll(items: any){
    console.log(items);
  }
  getAllCustomers(){
    var link = `${'Customers/GetAllCustomers'}`;
      var formData = {};
      this.appService.get(link,formData).subscribe(
        data => {
       this.dropdownListCustomers = data;
            
          }
         
        )
  }
}

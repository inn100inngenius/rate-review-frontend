import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { DataTableDirective } from 'angular-datatables';

import Swal from 'sweetalert2';





@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  providers:[ScriptService]

})
export class UserManagementComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  @ViewChild('datatable') table: ElementRef;
  dataTable: any;
  dtOptions: any = {};
  datatable: any;
  tableModal: any=[];

  dropdownListCustomers = [];
  dropdownListProperty = [];
  dropdownListRoles = [];

  selectedCustomerItems = [];
  selectedPropertyItems = [];
  selectedRoleItems = [];

  customerSettings = {};
  propertySettings = {};
  roleSettings = {};
  
  roles = [];
  listenerFn: () => void;
  customerList =[];
  filterData:any ={customers:[],properties:[]};
  dropdownSettingsCustomer: any = {};
  dropdownSettingsProperty: any = {};
  dropdownSettingsRole: any = {};
  propertyList = [];
  roleList=[];
  ShowFilter = true;
  constructor(private formBuilder: FormBuilder,private breadcrumbService: BreadcrumbService,
    private script:ScriptService,private appService:AppService,private renderer:Renderer2,
    private router:Router,private localStorageService:LocalStorageService) {
    this.setBreadcrumb();
    // this.script.load('tableInit').then(data => {
    // console.log('script loaded ', data);
    // }).catch(error => console.log(error));
    this.getTableData();
    this.getAllCustomers();
    this.getAllProperties();
    this.getAllRolesByUser();

   }
   setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer/dashboard'},
      {'page':'User Management','path':''}
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }

  ngOnInit(): void {
    // Customer
    this.dropdownSettingsCustomer = {
      singleSelection: false,
      idField: 'id',
      textField: 'user_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    this.dropdownSettingsProperty = {
      singleSelection: false,
      idField: 'id',
      textField: 'property_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    this.dropdownSettingsRole = {
      singleSelection: false,
      idField: 'id',
      textField: 'role_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
  }
  ngAfterViewInit(): void {
    this.listenerFn = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("data-edit-id")) {
        this.router.navigate(["user-management/edit/" + event.target.getAttribute("data-edit-id")]);
      }
      if (event.target.hasAttribute("data-delete-id")) {
        this.onDelete(event.target.getAttribute("data-delete-id"))
      }
      if (event.target.hasAttribute("data-permission-id")) {
        this.router.navigate(["user-management/permissions/" + event.target.getAttribute("data-permission-id")]);
      }
    });
  }
 
  getTableData(){

    var link = 'Users/GetTableData';
  
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
        dataTablesParameters.user_id = this.localStorageService.getValue().userId;
        dataTablesParameters.user_type = this.localStorageService.getValue().userType;
        dataTablesParameters.customer_id = this.localStorageService.getValue().customerId;
        that.appService
          .post(
            link,
            dataTablesParameters
          ).subscribe(resp => {
            that.tableModal = resp.data;
            
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: that.tableModal 
            });
          });
      },
      columns: [{ title:"no",data: null,
      render: function (data, type, row, meta) {
        return start + meta.row +1;
      } },
      {title:"first name",data:'first_name'},
      {title:"last name",data:'last_name'},
      {title:"user name",data:'user_name'},
      {title:"user email",data:'user_email'},
     

      // {title:"permission",
      // data:null,
      // render: function (data, type, row, meta) {
      //    return '<i class="fas fa-key tx-orange tx-12" role="button" data-permission-id="'+row.id+'" routerLink="/user-management/permissions"></i>';
      // }},
    //   {title:"user status",data:null,
    //   render: function (data, type, row, meta) {
    //     if(row.user_status == 1)
    //     {
    //       return '<label class="custom-btn btn-success">Active</label></td>';
    //     }
    //     else{
    //       return '<label class="custom-btn btn-danger">Deactive</label></td>';
    //     }
    //  }
    // },
    
      {title:"action",
      data:null,
      render: function (data, type, row, meta) {
        
         return '<a role="button" class="far fa-edit  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
      }}]
    };
    
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
        var link = `${'Users/Delete'}`;
      var formData = {id:id ,user_id:this.localStorageService.getValue().userId};
      that.appService.post(link,formData).subscribe(
        data => {
       
            that.reload();
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
          }
         
        )
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
    }
    OnItemDeSelect(item:any){
      console.log(item);
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
         this.customerList = data;
              
            }
           
          )
    }
   
    onCustomerChange(evType){
      if(evType == 4){
        this.filterData.customers = [];
        this.reload();
      }
      else if(evType == 3){
        this.filterData.customers =  this.customerList;
        this.reload();
      }
      else{
        this.reload();
      }
    }

    getAllProperties() {
      var formData = {user_id:this.localStorageService.getValue().userId,
        user_type:this.localStorageService.getValue().userType,
      customer_id:this.localStorageService.getValue().customerId,
      property_ids:this.localStorageService.getValue().propertyIds
    };
    var link = `${'Properties/GetAllProperties'}`;
    this.appService.get(link,formData).subscribe(
        data => {
          console.log(data);
          this.propertyList = data
        },
        err => {
        })
    }
    onPropertyChange(evType){
      if(evType == 4){
        this.filterData.properties = [];
        this.reload();
      }
      else if(evType == 3){
        this.filterData.properties =  this.propertyList;
        this.reload();
      }
      else{
        this.reload();
      }
    }
    getAllRolesByUser() {
      var formDta ={user_id:this.localStorageService.getValue().userId,
       user_type:this.localStorageService.getValue().userType,
       customer_id:this.localStorageService.getValue().customerId,
       property_ids:this.localStorageService.getValue().propertyIds}
       var link = `${'Roles/GetAllRolesByUser'}`;
       this.appService.get(link,formDta).subscribe(
       data => {
         console.log(data);
         this.roleList = data;
       })
      }
      onRoleChange(evType){
        if(evType == 4){
          this.filterData.roles = [];
          this.reload();
        }
        else if(evType == 3){
          this.filterData.roles =  this.roleList;
          this.reload();   
        }
        else{
          this.reload(); 
        }
        
      }
}

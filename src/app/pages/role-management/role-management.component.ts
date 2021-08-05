import { Component, ElementRef, OnInit, ViewChild,Renderer2  } from '@angular/core';
import { AppService } from '@app/app.service';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';

import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';

declare var $;

// class DataTablesResponse {
//   data: any[];
//   draw: number;
//   recordsFiltered: number;
//   recordsTotal: number;
// }
@Component({
  selector: 'app-role-managemment',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  providers:[ScriptService]
})

export class RoleManagementComponent implements OnInit {
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

  customerList =[];
  dropdownListProperties =[];
  selectedItemsCustomers = [];
  selectedItemsProperties = [];
  customerSettings = {};
  propertySettings = {};
  filterData:any ={customers:[],properties:[]};
  dropdownSettingsCustomer: any = {};
  dropdownSettingsProperty: any = {};
  ShowFilter = true;
  propertyList =[];

  constructor(private breadcrumbService: BreadcrumbService,
    private appService:AppService,private renderer: Renderer2, private router: Router,
    private localStorageService:LocalStorageService) {
   
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
    this.getAllProperties(); 
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
    
    // this.dropdownListCustomers = [
     
    // ];
    // this.selectedItemsCustomers = [ ];
    // this.customerSettings = { 
    //   labelKey:"user_name",
    //   primaryKey:"id", 
    //   singleSelection: false, 
    //   text:"Select Customers",
    //   selectAllText:'Select All',
    //   unSelectAllText:'UnSelect All',
    //   enableSearchFilter: true,
    //   classes:"myclass custom-class"
    // };  

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
        this.router.navigate(["role-management/edit/" + event.target.getAttribute("data-edit-id")]);
      }
      if (event.target.hasAttribute("data-delete-id")) {
        this.onDelete(event.target.getAttribute("data-delete-id"))
      }
      if (event.target.hasAttribute("data-permission-id")) {
        this.router.navigate(["role-management/permissions/" + event.target.getAttribute("data-permission-id")]);
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
        let filterCustomerIds = [];
        this.filterData.customers.map(x=>{
          filterCustomerIds.push(x.id);
        }).toString()
        let filterPropertyIds = [];
        this.filterData.properties.map(x=>{
          filterPropertyIds.push(x.id);
        }).toString()
        start = dataTablesParameters.start;
        dataTablesParameters.user_id = this.localStorageService.getValue().userId; 
        dataTablesParameters.user_type = this.localStorageService.getValue().userType; 
        dataTablesParameters.customer_id = this.localStorageService.getValue().customerId; 
        dataTablesParameters.filter_customers = filterCustomerIds.toString();
        dataTablesParameters.filter_properties = filterPropertyIds.toString();

        that.appService
          .post(
            link,
            dataTablesParameters
          ).subscribe(resp => {
            that.siteModal = resp.data;
            that.siteModal.map(x=>{
              x.prop = JSON.parse(x.prop);
              x.prop_name = '';
              x.prop.map(y=>{
                x.prop_name = x.prop_name+', ' + y.property_name;
              })
              x.prop_name = x.prop_name.substring(1);
            });
            // that.siteModal.prop.map(x=>{

            // })
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
      {title:"role name",data:'role_name'},
      {title:"Properties",data:'prop_name'},
      {title:"permission",
      data:null,
      render: function (data, type, row, meta) {
         return '<i class="fas fa-key tx-orange tx-12" role="button" data-permission-id="'+row.id+'" routerLink="/task-management/permissions"></i>';
      }},
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
      
      var link = `${'Roles/' + id}`;
      var formData = {};
      that.appService.delete(link,formData).subscribe(
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
}

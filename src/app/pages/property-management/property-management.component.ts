import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '../../_services/script.service';
import { DataTableDirective } from 'angular-datatables';
import { AppService } from '@app/app.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-property-management',
  templateUrl: './property-management.component.html',
  styleUrls: ['./property-management.component.less'],
  providers: [ ScriptService ]

})
export class PropertyManagementComponent implements OnInit {
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
  ShowFilter = true;
  customerList =[];
  selectedItemsCustomers = [];
  customerSettings = {};
  dropdownSettingsCustomer: any = {};
  filterData:any ={customers:[]};
  constructor(private formBuilder: FormBuilder,private breadcrumbService: BreadcrumbService,
    private script:ScriptService,private appService:AppService,
    private renderer: Renderer2, private router: Router,
    private localStorageService:LocalStorageService) { 
  
    this.setBreadcrumb();
    
  }
  setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer/dashboard'},
      {'page':'Property Management','path':''},
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }
  ngOnInit(): void {
     this.getTableData();
     this.getAllCustomers();
     this.dropdownSettingsCustomer = {
      singleSelection: false,
      idField: 'id',
      textField: 'user_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    // this.customerList = [
        
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
  }
  ngAfterViewInit(): void {
    this.listenerFn = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("data-edit-id")) {
        this.router.navigate(["property-management/edit/" + event.target.getAttribute("data-edit-id")]);
      }
      if (event.target.hasAttribute("data-delete-id")) {
        this.onDelete(event.target.getAttribute("data-delete-id"))
      }
      if (event.target.hasAttribute("data-view-page")) {
        this.router.navigate([event.target.getAttribute("data-view-page")]);
      }
    });
  }
  getTableData(){
    
    var link = 'Properties/GetTableData';
  
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
        that.filterData.customers.map(x=>{
          filterCustomerIds.push(x.id);
        }).toString();
        start = dataTablesParameters.start;
        dataTablesParameters.customer_id =this.localStorageService.getValue().userId;
        dataTablesParameters.filter_customers = filterCustomerIds.toString();
        that.appService
          .post(
            link,
            dataTablesParameters
          ).subscribe(resp => {
            that.siteModal = resp.data;
            that.siteModal.map(x=>{
              x.key_staff = JSON.parse(x.key_staff);
              x.key_staff_email = x.key_staff[0].user_email;
              x.key_staff_name = x.key_staff[0].user_name;
            })
            
            
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
      {title:"property code",data:'property_code'},
      {title:"property name",data:'property_name'},
      {title:"Key staff name",data:'key_staff_name'},
      {title:"Key staff email",data:'key_staff_email'},
    //   {title:"user status",data:null,
    //   render: function (data, type, row, meta) {
    //     if(row.user_status == 0)
    //     {
    //       return '<button  class="custom-btn tx-12 wd-90 rounded btn-danger mg-r-5"> Deactive</button>';
    //     }
    //     else{
    //       return '<button *ngIf="item.status==1" class="custom-btn tx-12 wd-90 rounded btn-success mg-r-5">Active</button>';
    //     }
    //  }
    // },
    {title:"overview",data:null,
      render: function (data, type, row, meta) {
          return '<a  ><button data-view-page="task-management"  class="custom-btn btn-info tx-12 mg-b-1 wd-md-60p wd-lg-100 rounded btn-secondary mg-r-5">Tasks</button></a> <a ><button data-view-page="document/dashboard" class="custom-btn tx-12 mg-t-1 wd-md-60p wd-lg-100 rounded btn-info justify-margin">Documents</button></a>';
     }
    },
      {title:"action",
      data:null,
      render: function (data, type, row, meta) {
         return '<a role="button" class="far fa-edit  pd-4 tx-12 mr-1" data-edit-id="'+row.id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.id+'"></a>';
      }}]
    };
    
  }
  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
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
      
      var link = `${'Properties/Delete'}`;
      var formData = {id:id,
      user_id:this.localStorageService.getValue().userId};
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
            console.log(data);
          },
          err=>{
            //console.log("error");
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
}

import { Component, ElementRef, OnInit, Renderer2, Type, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import {  BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '../../_services/script.service';
import { DataTableDirective } from 'angular-datatables';

import Swal from 'sweetalert2';
import { AppService } from '@app/app.service';
import { Router } from '@angular/router';





@Component({
  selector: 'app-customer-management',
  templateUrl: './list.component.html',
  styleUrls: ['./customer-management.component.css'],
  providers: [ ScriptService ]
})


export class ListComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  @ViewChild('datatable') table: ElementRef;
  dataTable: any;
  dtOptions: any = {};
  // tableModal: tableModal[];
  // dataTablesResponse: DataTablesResponse[];
  datatable: any;
  tableModal: any=[];
  
  roles = [];
  listenerFn: () => void;


  
  constructor(private formBuilder: FormBuilder, private breadcrumbService: BreadcrumbService,
    private script:ScriptService,private appService:AppService,
    private renderer:Renderer2,private router:Router,
    private localStorageService:LocalStorageService) { 
    this.setBreadcrumb();
  }
  setBreadcrumb(){
    
    let breadcrumbData = [
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer'}
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);

  }
  ngOnInit(): void {
      this.getTableData();
  }
  ngAfterContentInit() {
    this.listenerFn = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("data-edit-id")) {
        this.router.navigate(["customer/edit/" + event.target.getAttribute("data-edit-id")]);
      }
      if (event.target.hasAttribute("data-delete-id")) {
        this.onDelete(event.target.getAttribute("data-delete-id"))
      }
      
    });
  }

getTableData(){

  var link = 'Customers/GetTableData';

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
    {title:"name",data:'user_name'},
    {title:"email",data:'user_email'},
    {title:"property limit",data:'no_of_properties'},
    {title:"trial period",data:null,
      render: function (data, type, row, meta) {

        if(row.trial_period == '')
        {
          return 'N/A';
        }
        else{
          return row.trial_period;
        }
     }
    },
  //   {title:"status",data:null,
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
      
       return '<a role="button" class="far fa-edit  pd-4 tx-12 mr-1" data-edit-id="'+row.user_id+'"></a><a role="button" class="far fa-trash-alt pd-4 tx-12 ml-1" data-delete-id="'+row.user_id+'"></a>';
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
        var link = `${'Customers/Delete'}`;
        var formData = {
          id:id,
          user_id:that.localStorageService.getValue().userId
          };
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
}


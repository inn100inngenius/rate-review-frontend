import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild,Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentApiService } from '../document-api.service';
import { BreadcrumbService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-document-audit',
  templateUrl: './document-audit.component.html',
  styleUrls: ['./document-audit.component.less'],
  providers:[ScriptService]
})
export class DocumentAuditComponent implements OnInit {

  
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
    model: NgbDateStruct;
  
  
   
  
    constructor(private breadcrumbService: BreadcrumbService, private calendar: NgbCalendar,
       public formatter: NgbDateParserFormatter,
       private script:ScriptService, private documentApiService:DocumentApiService,
       private renderer: Renderer2, private router: Router) {
      this.setBreadcrumb();
     
     }
  
    setBreadcrumb(){
      let breadcrumbData = [ 
        {'page':'home','path':'/home'},
        {'page':'Audit Trail','path':''},
  
      ];
      this.breadcrumbService.changeMessage(breadcrumbData);
    }
  
    
   
    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
      const parsed = this.formatter.parse(input);
      return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }
  
  
    ngOnInit(): void {
      this.getTableData();
    }
  
    
    getTableData(){
  
      var link = 'Audit/GetDataTable';
    
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
          dataTablesParameters.user_id = localStorage.getItem('userId');
          dataTablesParameters.user_type = localStorage.getItem('userType');
          dataTablesParameters.customer_id = localStorage.getItem('customerId');
          that.documentApiService
            .getDocumentAuditTrails(
              dataTablesParameters
            ).subscribe(resp => {
              that.siteModal = resp.data;
              
              // that.siteModal.prop.map(x=>{
  
              // })
              this.siteModal.map(x => {
                
                x.date = formatDate(x.created_at, 'd MMM y', 'en-US');
                x.time = formatDate(x.created_at, 'h:mm:ss a', 'en-US');
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
        {title:"date",data:'date'},
        {title:"time",data:'time'},
        {title:"Ip",data:'user_ip'},
        {title:"country",data:'country_name'},
        {title:"User",data:'user_name'},
        {title:"audit",data:'description'},
        
        ]
      };
      
    }
    
  }
  


import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild,Renderer2  } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { TaskApiService } from '../task-management/task-api.service';
interface Records {
  id?: number;
  userId: string;
  userName: string;
  date: string;
  time: string;
  action: string;
  IP: string;
  country: string;
  comment: number;
}

const RECORDS: Records[] = [
  {
    userId: '1247',
    userName: 'Test User',
    date: '2020:12:19',
    time: '08:30 AM',
    action: 'Login Activity',
    IP: '190.168.202.170',
    country: 'USA',
    comment: 1,    
  },
  {
    userId: '1245',
    userName: 'Robert',
    date: '2020:12:20',
    time :'10:57 PM',
    action: 'Logouts',
    IP: '190.168.202.145',
    country: 'UK',
    comment: 2,
  },
  {
    userId: '1152',
    userName: 'Octavia',
    date: '2021:02:07',
    time: ' 11:30 AM',
    action: 'Create User',
    IP: '190.168.199.211',
    country: 'USA',
    comment: 3,
  },
  {
    userId: '0028',
    userName: 'Ann Marie',
    date: '2021:01:30',
    time: '06:10 PM',
    action: 'Document Approvals',
    IP: '190.168.101.101',
    country: 'USA',
    comment: 4,
  }
];

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css'],
  providers:[ScriptService]
})
export class AuditTrailComponent implements OnInit {
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
  page = 1;
  pageSize = 5;
  collectionSize = RECORDS.length;
  // records: Records[];
  searchTerm: "";

  records = RECORDS;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  dropdownSettingsUser: any = {};
  roleList =[];
  userList =[];
  filterData :any = {users:[]};
  ShowFilter = true;
  constructor(private breadcrumbService: BreadcrumbService, private calendar: NgbCalendar,
     public formatter: NgbDateParserFormatter,
     private script:ScriptService, private appService:AppService,
     private renderer: Renderer2, private router: Router,
     private localStorageService:LocalStorageService,
     private taskApiService:TaskApiService) {
    this.setBreadcrumb();
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    // this.script.load('tableInit').then(data => {
    // console.log('script loaded ', data);
    // }).catch(error => console.log(error));
   }

  setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Audit Trail','path':''},

    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


  ngOnInit(): void {
    this.getTableData();
    this.dropdownSettingsUser = {
      singleSelection: false,
      idField: 'id',
      textField: 'user_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    this.getAllUsersByUser();
  }

  getAllUsersByUser() {
    var formDta ={user_id:this.localStorageService.getValue().userId,
     user_type:this.localStorageService.getValue().userType,
     customer_id:this.localStorageService.getValue().customerId,
     property_ids:this.localStorageService.getValue().propertyIds}
   this.taskApiService.getAllUsersByUser(formDta).subscribe(
     data => {
       console.log(data);
       this.userList = data;
     })
    }
  getTableData(){

    console.log(123);
    let filterUserIds = [];
    this.filterData.users.map(x=>{
      filterUserIds.push(x.id);
     })
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
        dataTablesParameters.filter_users = filterUserIds.toString();

        that.appService
          .post(
            link,
            dataTablesParameters
          ).subscribe(resp => {
            that.siteModal = resp.data;
            
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
  onUserChange(evType){
    
    console.log(evType);
    if(evType == 4){
      this.filterData.users = [];
      this.reload();
    }
    else if(evType == 3){
      this.filterData.users =  this.userList;
      this.reload();
    }
    else{
      this.reload();
    }
    
  }

  reload() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }
}

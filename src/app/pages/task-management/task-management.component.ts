import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AddEditComponent } from './add/add-edit.component';
import { ViewComponent } from './view/view.component';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { Router } from '@angular/router';
import { TaskApiService } from './task-api.service';
import { formatDate } from '@angular/common';

interface NavItem {
  displayName: string;
  disabled?: boolean;
  route?: string;
  children?: NavItem[];
}
declare let $: any;
@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css'],
  providers: [ScriptService]

})

export class TaskManagementComponent implements OnInit {

  taskList = [];
  taskTodo = [];
  taskInprogress = [];
  taskCompleted = [];
  taskNotCompleted = [];
  systemTasks = [];
  dropdownList = [];
  selectedItems = [];
  userSettings = {};
  propertySettings = {};
  roleSettings = {};
  dropdownListRoles = [];
  selectedItemsRoles = [];
  dropdownListUsers = [];
  selectedItemsUsers = [];
  closeResult = '';

  userstate: boolean;
  urlFragment: string;

  statusNotation: number;
  urlStatusFragment: string;

  model: NgbDateStruct;

  showFiller = true;
  panelOpenState = true;
  
  taskTypeLists = [
   // "portlet-card-list-1",
    "portlet-card-list-2",
    "portlet-card-list-3",
    "portlet-card-list-4"
  //  "portlet-card-list-5"
  ];
  // 
  filterData :any = {properties:[],roles:[],users:[]};
  ShowFilter = true;
  selectedProperties = [];
  propertyList = [];
  dropdownSettings: any = {};
  dropdownSettingsRole: any = {};
  dropdownSettingsUser: any = {};
  roleList =[];
  userList =[];
  taskListFilter;
  
  constructor(private modalService: NgbModal, private breadcrumbService: BreadcrumbService,
    private script: ScriptService, private router: Router, private taskApiService: TaskApiService,
    private localStorageService:LocalStorageService) {

    this.script.load('datePickerjs').then(data => {
      console.log('script loaded ', data);
    }).catch(error => console.log(error));
  }

  ngOnInit(): void {
    this.dropdownSettings = {
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
    this.dropdownSettingsUser = {
      singleSelection: false,
      idField: 'id',
      textField: 'user_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter
    };
    this.getAllPropertiesByUserId();
    this.getAllRolesByUser();
    this.getAllUsersByUser();
    var _this = this;
    $.getScript('assets/azia/lib/jquery/jquery-ui.min.js', function () {
      //script is loaded and executed put your dependent JS here
      var startDiv;
      var endDiv;

      $("#portlet-card-list-1, #portlet-card-list-2, #portlet-card-list-3,#portlet-card-list-4,#portlet-card-list-5")
        .sortable(
          {disabled: false ,
            connectWith: "#portlet-card-list-1, #portlet-card-list-2, #portlet-card-list-3,#portlet-card-list-4,#portlet-card-list-5",
            items: ".portlet-card:not(.disable-sort-item)",
            cancel: ".disable-sort-item",
            start: function (event, ui) {
              startDiv = $(ui.item).parent()[0].id;
            },
            stop: function (event, ui) {
             // console.log(event,ui.item[0].id);
              let task_id = ui.item[0].id;
              endDiv = $(ui.item).parent()[0].id;
              if (startDiv != endDiv) {
                if (_this.taskTypeLists.indexOf(endDiv) != -1 && _this.taskTypeLists.indexOf(startDiv) != -1) {
                 // console.log("task type - ", _this.taskTypeLists.indexOf(endDiv));
                  let task_status =_this.taskTypeLists.indexOf(endDiv) ;
                  var data = {task_id:task_id,task_status:task_status,
                    user_id:_this.localStorageService.getValue().userId,
                    user_type:_this.localStorageService.getValue().userType,
                    customer_id:_this.localStorageService.getValue().customerId,
                    property_ids:_this.localStorageService.getValue().propertyIds}
                  _this.taskApiService.changeTaskStatus(data).subscribe(
                    data => {},
                    err=>{})
                }
              }
            },
            beforeStop: function(ev, ui) {
              endDiv = $(ui.item).parent()[0].id;
              if (startDiv != endDiv) {
                if (_this.taskTypeLists.indexOf(endDiv) == -1 || _this.taskTypeLists.indexOf(startDiv) == -1) {
                  $(this).sortable('cancel');
                  
                }
              }
             
          },
            update: function (event, ui) {
             
              // $.post('/reorder', $(selector).sortable('serialize'))
              //     .done(function() {
              //         alert('Updated')
              //     });
            }
          });
    });
    this.getAllTasks();
    // this.dropdownList = [
    //   { "id": 1, "itemName": "Property 1" },
    //   { "id": 2, "itemName": "Property 2" },
    //   { "id": 3, "itemName": "Property 3" },
    //   { "id": 4, "itemName": "Property 4" },
    //   { "id": 5, "itemName": "Property 5" },
    //   { "id": 6, "itemName": "Property 6" },
    //   { "id": 7, "itemName": "Property 7" },
    //   { "id": 8, "itemName": "Property 8" },
    //   { "id": 9, "itemName": "Property 9" },
    //   { "id": 10, "itemName": "Property 10" }
    // ];
    // this.selectedItems = [];
    // this.dropdownListRoles = [
    //   { "id": 1, "itemName": "Role 1" },
    //   { "id": 2, "itemName": "Role 2" },
    //   { "id": 3, "itemName": "Role 3" },
    //   { "id": 4, "itemName": "Role 4" },
    //   { "id": 5, "itemName": "Role 5" },
    //   { "id": 6, "itemName": "Role 6" },

    // ];
    // this.selectedItemsRoles = [];
    this.dropdownListUsers = [
      { "id": 1, "itemName": "User 1" },
      { "id": 2, "itemName": "User 2" },
      { "id": 3, "itemName": "User 3" },
      { "id": 4, "itemName": "User 4" },
      { "id": 5, "itemName": "User 5" },
      { "id": 6, "itemName": "User 6" },
      { "id": 7, "itemName": "User 7" },
      { "id": 8, "itemName": "User 8" },
      { "id": 9, "itemName": "User 9" },
      { "id": 10, "itemName": "User 10" }
    ];
    this.selectedItemsUsers = [];
    // this.propertySettings = {
    //   singleSelection: false,
    //   text: "Select Properties",
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   enableSearchFilter: true,
    //   classes: "myclass custom-class"
    // };
    // this.roleSettings = {
    //   singleSelection: false,
    //   text: "Select Roles",
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   enableSearchFilter: true,
    //   classes: "myclass custom-class"
    // };
    this.userSettings = {
      singleSelection: false,
      text: "Select Users",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

  }

  

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  open() {
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
    const modalRef = this.modalService.open(AddEditComponent, { size: 'lg' });
    modalRef.componentInstance.name = "World";
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  viewTask() {

    const modalRef = this.modalService.open(ViewComponent, { size: 'xl' });
    modalRef.componentInstance.name = "World";
  }

  // Multiselect
  onItemSelect(item: any) {
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }

  // Breadcrumb Navigation Buttons
  myTask(){
    this.router.navigate(['/task-management/my-tasks']);
  }
  taskcalendar(){ 
    this.router.navigate(['/calendar']);
  }
  createTask(){
    this.router.navigate(['/task-management/add']);
  }
  // Navigate Task details
  taskDetails(data) {
    // this.statusNotation = data  != null ? data : 0 ;
    // this.urlStatusFragment = data != 0 ? data == 1 ? "Approve" : "Review" : "view";
    // this.router.navigate(['/task-management/view/'], {queryParams: { status: this.statusNotation }, fragment: this.urlStatusFragment });
    this.router.navigate(['/task-management/view/' + data]);
  }
  systemTaskDetails(data){
    this.router.navigate(['/system-tasks/view/' + data]);
  }

  // Navigate timeline
  gotoTimeline(val) {
    this.router.navigate(['/task-management/timeline/'+ val]);
    // this.userstate = val == 0 ? false : true;
    // this.urlFragment = val == 0 ? "timeline" : "multitimelines";
    // this.router.navigate(['/task-management/timeline'], { queryParams: { multi: this.userstate }, fragment: this.urlFragment });
  }

  getAllTasks() {
    this.systemTasks= [];
    this.taskTodo  = [], this.taskInprogress  = [],this.taskCompleted = [] ,  this.taskNotCompleted= [];
    let filterPropIds =[] ;
    this.filterData.properties.map(x=>{
     filterPropIds.push(x.id);
    })
    let filterRoleIds = [];
    this.filterData.roles.map(x=>{
      filterRoleIds.push(x.id);
     })
     let filterUserIds = [];
    this.filterData.users.map(x=>{
      filterUserIds.push(x.id);
     })
     var formDta ={user_id:this.localStorageService.getValue().userId,
      user_type:this.localStorageService.getValue().userType,
      customer_id:this.localStorageService.getValue().customerId,
      property_ids:this.localStorageService.getValue().propertyIds,
      filter_properties:filterPropIds.toString(),
      filter_roles:filterRoleIds.toString(),
      filter_users:filterUserIds.toString()
    }
    this.taskApiService.getAllTasks(formDta).subscribe(
      data => {
       // console.log(data);
         
        this.taskList = data;
        this.taskList.map(x => {
          x.task_properties = x.task_properties == null ?[]:JSON.parse(x.task_properties);
          x.task_users = x.task_users == null ?[]:JSON.parse(x.task_users);
          x.start_date = formatDate(x.start_date, 'd MMM y', 'en-US');
          x.due_date = formatDate(x.due_date, 'd MMM y', 'en-US');
          x['days_to_due'] = this.calculateDiff(x.due_date);
          x.task_status = x['days_to_due'] < 0 && x.task_status!=2  ? 3:x.task_status;
          x.task_approvers = JSON.parse(x.task_approvers);
          x.task_approvers.map(itm => {
            if (itm.user_id == this.localStorageService.getValue().userId) {
              x['my_approval'] = true;
            }
          })
          x.task_reviewers = JSON.parse(x.task_reviewers);
          x.task_reviewers.map(itm => {
            if (itm.user_id == this.localStorageService.getValue().userId) {
              x['my_reviewal'] = true;
            }
          })
          let totalPercentage =0;
          let total =0;
          let totalUsers  = x.task_users.length;
          x['my_task'] = false;
          x.task_users.map(u=>{
            if (u.user_id == this.localStorageService.getValue().userId) {
              x['my_task'] = true;
              x['my_task_status'] = u.task_status;
              x['my_action_status'] = u.task_status == 2 && u.approve_status == 1 && u.review_status == 0?'Approved':
                                      u.task_status == 2 && u.approve_status == 1 && u.review_status == 1?'Done':
                                      u.task_status == 2 && u.approve_status == 2 && u.review_status == 0?'Rejected':
                                      u.task_status == 2 && u.approve_status == 0 && u.review_status == 0?'Pending':
                                      ''  ;
            }
            if(u.task_status == 0){ totalPercentage = totalPercentage + 20  }
            if(u.task_status == 1){ totalPercentage = totalPercentage + 40  }
            if(u.task_status == 2){ totalPercentage = totalPercentage + 60  }
            if(u.approve_status == 1){ totalPercentage = totalPercentage + 20  }
            if(u.review_status == 1){ totalPercentage = totalPercentage + 20  }
          })
          total = totalPercentage / totalUsers;
          x['task_percentage'] = total;
          if(x.my_task){
            if(x.task_type == 1){
              if (x.my_task_status == 0) {
                this.taskTodo.push(x);
              }
              else if (x.my_task_status == 1) {
                this.taskInprogress.push(x);
              }
              else if (x.my_task_status == 2) {
                this.taskCompleted.push(x);
              }
              else if (x.my_task_status == 3) {
                this.taskNotCompleted.push(x);
              }
            }
            else{
              this.systemTasks.push(x);
            }
            
          }
         else{
          if(x.task_type == 1){
            if (x.task_status == 0) {
              this.taskTodo.push(x);
            }
            else if (x.task_status == 1) {
              this.taskInprogress.push(x);
            }
            else if (x.task_status == 2) {
              this.taskCompleted.push(x);
            }
            else if (x.task_status == 3) {
              this.taskNotCompleted.push(x);
            }
          }
          else{
            this.systemTasks.push(x);
          }
         }
          
         
        })
        this.taskListFilter = this.taskList;
       // console.log(this.systemTasks,this.taskTodo, this.taskInprogress, this.taskCompleted, this.taskNotCompleted);
      },
      err => {
      })
  }
  calculateDiff(sentDate) {
    var date1: any = new Date(sentDate);
    var date2: any = new Date();
    var diffDays: any = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // 
  
  getAllPropertiesByUserId() {
    var formDta ={user_id:this.localStorageService.getValue().userId,
     user_type:this.localStorageService.getValue().userType,
     customer_id:this.localStorageService.getValue().customerId,
     property_ids:this.localStorageService.getValue().propertyIds}
   this.taskApiService.getAllProperties(formDta).subscribe(
     data => {
       this.propertyList = data;
     })
    }
    getAllRolesByUser() {
      var formDta ={user_id:this.localStorageService.getValue().userId,
       user_type:this.localStorageService.getValue().userType,
       customer_id:this.localStorageService.getValue().customerId,
       property_ids:this.localStorageService.getValue().propertyIds}
     this.taskApiService.getAllRolesByUser(formDta).subscribe(
       data => {
         this.roleList = data;
       })
      }
      
      getAllUsersByUser() {
        var formDta ={user_id:this.localStorageService.getValue().userId,
         user_type:this.localStorageService.getValue().userType,
         customer_id:this.localStorageService.getValue().customerId,
         property_ids:this.localStorageService.getValue().propertyIds}
       this.taskApiService.getAllUsersByUser(formDta).subscribe(
         data => {
           this.userList = data;
         })
        }
    onPropertyChange(evType){
      if(evType == 4){
        this.filterData.properties = [];
        this.getAllTasks();
      }
      else if(evType == 3){
        this.filterData.properties =  this.propertyList;
        this.getAllTasks();
      }
      else{
        this.getAllTasks();
      }
      
    }

    onRoleChange(evType){
      if(evType == 4){
        this.filterData.roles = [];
        this.getAllTasks();
      }
      else if(evType == 3){
        this.filterData.roles =  this.roleList;
        this.getAllTasks();
      }
      else{
        this.getAllTasks();
      }
      
    }
    onUserChange(evType){
      if(evType == 4){
        this.filterData.users = [];
        this.getAllTasks();
      }
      else if(evType == 3){
        this.filterData.users =  this.userList;
        this.getAllTasks();
      }
      else{
        this.getAllTasks();
      }
      
    }
    //this.selectedItems = [];
// filterTasks(){
//   let filterPropIds =[] ;
//     this.filterData.properties.map(x=>{
//      filterPropIds.push(x.id);
//     })
//     console.log(this.taskListFilter);
//  let filterdata = this.taskListFilter.filter(x=>{
//     return x.task_properties.find(p=>filterPropIds.includes(p.property_id));
//      // console.log(filterPropIds.includes(p.property_id))})
//   })
//   console.log(filterdata);
//   this.taskList =filterdata;
//   this.taskList.map(x=>this.assignTasksToCards(x));
// }
// assignTasksToCards(x){
//   this.systemTasks= [];
//   this.taskTodo  = [], this.taskInprogress  = [],this.taskCompleted = [] ,  this.taskNotCompleted= [];

//   if(x.task_type == 1){
//     if (x.task_status == 0) {
//       this.taskTodo.push(x);
//     }
//     else if (x.task_status == 1) {
//       this.taskInprogress.push(x);
//     }
//     else if (x.task_status == 2) {
//       this.taskCompleted.push(x);
//     }
//     else if (x.task_status == 3) {
//       this.taskNotCompleted.push(x);
//     }
//   }
//   else{
//     this.systemTasks.push(x);
//   }
 

//}
}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { TaskApiService } from '@app/pages/task-management/task-api.service';
import { LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { ToastService } from '@app/_services/toast.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentApiService } from '../document-api.service';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.less'],
  providers:[ScriptService]
})
export class CheckinComponent implements OnInit {

  docForm: FormGroup;
  submitted = false;
  id: string
  data: any
  


  // 
  selectedProperties = [];
  propertyList = [];
  dropdownSettings: any = {};
  ShowFilter = true;

  selectedRoles = [];
  roleList = [];
  roleListAll = [];
  dropdownSettingsRole: any = {};

  selectedUsers = [];
  userListAll = [];
  userList = [];
  dropdownSettingsUser: any = {};
  // 
  newApproverArray = [];
  newReviewerArray = [];

  
  
   selectedApprovers = [];
   selectedReviewers = [];
   
   approvers: FormArray;
  reviewers: FormArray;
  approverList: Array<any> = []
  reviewerList: any = []
  
  documents = [];
  constructor(private script:ScriptService, public appService: AppService, private route: ActivatedRoute,
    private documentApiService:DocumentApiService,private localStorageService:LocalStorageService,
    private formBuilder: FormBuilder,
    public toastService: ToastService, 
    private SpinnerService: NgxSpinnerService,
    private taskApiService: TaskApiService,
    private router: Router
    ) {
      this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];   
         if(this.id){
          this.getDocumentDetailsById();
         }
        }
      );
   }

   change(event) {
    console.log(event)
    this.approverList.forEach(element => {
      if(event.target[event.target.options.selectedIndex].value===element.name){
        element.isdisabled=true;
      }
    });

    this.reviewerList.forEach(element => {
      if(event.target[event.target.options.selectedIndex].value===element.name){
        element.isdisabled=true;
      }
    });
  }

   ngOnInit(): void {
    this.getAllProperties();
    this.getRolesByPropertyId();
    this.getUsersByPropertyAndRoleId();
    this.getDocumentTree();
   this.docForm = this.formBuilder.group({
    
    // doc_type: ['', Validators.required],
    // approval_date: ['', Validators.required],
    version:['', Validators.required],
     expiry_date: ['', Validators.required],
     remarks: [''],
     //properties: [this.selectedProperties],
     properties: [this.selectedProperties, Validators.required],
     roles: [this.selectedRoles, Validators.required],
     users: [this.selectedUsers, Validators.required],
     approvers: this.formBuilder.array([this.createItemApprovers()]),
     reviewers: this.formBuilder.array([this.createItemReviewers()])
     // properties: ['', Validators.required],
     // items: this.formBuilder.array([ this.createItem() ])
   });
   this.dropdownSettings = {
     singleSelection: false,
     idField: 'id',
     textField: 'property_name',
     selectAllText: 'Select All',
     unSelectAllText: 'UnSelect All',
     itemsShowLimit: 3,
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
     idField: 'user_id',
     textField: 'user_name',
     selectAllText: 'Select All',
     unSelectAllText: 'UnSelect All',
     itemsShowLimit: 3,
     allowSearchFilter: this.ShowFilter
   };
   this.newApproverArray[0] = this.approverList;
   this.newReviewerArray[0] = this.reviewerList;
  }

  getAllProperties() {
    var formData = {user_id:this.localStorageService.getValue().userId,
      user_type:this.localStorageService.getValue().userType,
    customer_id:this.localStorageService.getValue().customerId,
    property_ids:this.localStorageService.getValue().propertyIds
  };
    this.taskApiService.getAllProperties(formData).subscribe(
      data => {
        console.log(data);
        this.propertyList = data
      },
      err => {
      })
  }

  getRolesByPropertyId() {
    this.documentApiService.getAllRoles().subscribe(
      data => {
        console.log(data);
        this.roleListAll = data;
        //this.roleList = data;
      },
      err => {
      })
  }
  getUsersByPropertyAndRoleId() {
    this.documentApiService.getAllUsers().subscribe(
      data => {
        console.log(data);
        this.userListAll = data;
        // this.approverList = data;
        // this.reviewerList = data;
      },
      err => {
      })
  }
  changeApprover() {
    this.selectedApprovers = this.docForm.value.approvers.map(x => x.approver);
  }
  get formArr() {
    return this.docForm.get('approvers') as FormArray;
  }
  createItemApprovers(): FormGroup {
    return this.formBuilder.group({
      approver: ['', Validators.required],

    });
  }
  addItemApprovers(): void {

    this.approvers = this.docForm.get('approvers') as FormArray;
    this.approvers.push(this.createItemApprovers());
  }
  removeItemApprovers(index) {

    this.approvers = this.docForm.get('approvers') as FormArray;
    this.approvers.removeAt(index);
    this.changeApprover();
  }
  changeReviewer() {
    this.selectedReviewers = this.docForm.value.reviewers.map(x => x.reviewer);
  }
  // get formArr() {
  //   return this.docForm.get('approvers') as FormArray;
  // }
  createItemReviewers(): FormGroup {
    return this.formBuilder.group({
      reviewer: ['', Validators.required],

    });
  }
  addItemReviewers(): void {

    this.reviewers = this.docForm.get('reviewers') as FormArray;
    this.reviewers.push(this.createItemReviewers());
  }
  removeItemReviewers(index) {

    this.reviewers = this.docForm.get('reviewers') as FormArray;
    this.reviewers.removeAt(index);
    this.changeReviewer();
  }
  onPropertyChange(t) {
    this.docForm.patchValue({
      roles: [],
      users: []
    });
    this.roleList = [];
    let selectedIds = [];
    let selectedValues = {};
    this.docForm.value.properties.map(itm => {
      this.roleListAll.map(x => {
        if (x.property_ids.split(',').includes(itm.id.toString())) {
          if (!selectedIds.includes(x.id)) {
            selectedIds.push(x.id)
            selectedValues[x.id] = Object.assign({}, x);
            selectedValues[x.id]["selected_prop"] = itm.property_name;
            this.roleList.push(x);
          }
          else {
            selectedValues[x.id]["selected_prop"] = selectedValues[x.id]["selected_prop"] +
              " , " + itm.property_name;
          }
        }
      })

    })
    

    this.roleList = Object.values(selectedValues).map((itm, i) => {
      itm["role_name"] = itm["role_name"] + ' (' + itm["selected_prop"] + ')';
      return itm;
    });
    this.getApproversByPropertyIds(this.docForm.value.properties);
    this.getReviewersByPropertyIds(this.docForm.value.properties);
    if(t == 2){
      var _this = this;
      setTimeout(function(){ 
        console.log(_this.docData.doc_roles);
        _this.docForm.patchValue({
          roles:_this.docData.doc_roles
        })
        _this.onRoleChange(2);
    }, 1000);
      
    }
  }
  getApproversByPropertyIds(itm) {
  
    var names = itm.map(function(item) {
      return item['id'];
    });
    let data = {"property_ids":names.toString()}
    this.taskApiService.getApproversByPropertyIds(data).subscribe(
      data => {
        console.log(data);
        this.approverList = data;
       // this.roleListAll = data;
        //this.roleList = data;
      },
      err => {
      })
  }
  getReviewersByPropertyIds(itm) {
  
    var names = itm.map(function(item) {
      return item['id'];
    });
    let data = {"property_ids":names.toString()}
    this.taskApiService.getReviewersByPropertyIds(data).subscribe(
      data => {
        console.log(data);
       // this.approverList = data;
        this.reviewerList = data;
       // this.roleListAll = data;
        //this.roleList = data;
      },
      err => {
      })
  }
  onPropertySelectAll() {
    this.docForm.patchValue({
      properties: this.propertyList
    });
    this.onPropertyChange(1);
  }
  onPropertyDeSelectAll() {
    this.docForm.patchValue({
      roles: [],
      users: []
    });
    this.roleList = [];
  }
  onRoleChange(t) {
    this.docForm.patchValue({

      users: []
    });
    this.userList = [];
    let userIds = [];
    let selectedValues = {};
    let propertyIds = this.docForm.value.properties.map(x => x.id);
    let roleIds = this.docForm.value.roles.map(x => x.id);
    this.userListAll.map(x => {
      let roles_properties = JSON.parse(x.roles_properties);
      roles_properties.map(itm => {
        if (propertyIds.includes(itm.property) && roleIds.includes(itm.role)) {
          if (!userIds.includes(x.user_id)) {
            userIds.push(x.user_id);
            this.userList.push({ user_id: x.user_id, user_name: x.user_name })
          }
        }
      })
    })
    if(t == 2){
      var _this = this;
      setTimeout(function(){ 
        _this.docForm.patchValue({
          users:_this.docData.doc_users
        })
        document.getElementById('prop').click();
    }, 1000);
     
    }
  }
  onRoleSelectAll() {
    this.docForm.patchValue({
      roles: this.roleList
    });
    this.onRoleChange(1);
  }
  onRoleDeSelectAll() {
    this.docForm.patchValue({
      users: []
    });
    this.userList = [];
  }
  onUserSelect(item: any) {
  }
  onSubmit() {
    this.submitted = true;
    
   // return;
    let pathStr = "";
    // this.pathIds.slice(0).reverse().map(x=>{
    //   if(x.node_name)
    //   {pathStr = pathStr + x.node_name + '/';}
    // })
    this.docForm.value.created_by =this.localStorageService.getValue().userId; 
    this.docForm.value.path_ids = pathStr ;
    this.docForm.value.parent_id = this.docData.parent_id;
   // console.log(this.docForm.value);
    if (this.id === undefined) {
      this.saveRecord();
    }
    else {
      this.saveRecord();
     // this.updateRecord();
    }
  }
  saveRecord(){
   // var approvalDateObj = this.docForm.value.approval_date;
    //this.docForm.value.approval_date_str = approvalDateObj.year + '/' + approvalDateObj.month + '/' + approvalDateObj.day;
    this.docForm.value.approval_date_str = '';
    var expiryDateObj = this.docForm.value.expiry_date;
    this.docForm.value["expiry_date_str"] = expiryDateObj.year + '/' + expiryDateObj.month + '/' + expiryDateObj.day;
    // console.log(startDateObj.year +'/'+ startDateObj.month +'/'+ startDateObj.day,this.docForm.value.start_date )
this.docForm.value.doc_path_str = this.docData.document_path;
    this.docForm.value.created_by = this.localStorageService.getValue().userId;
    let colneObj = Object.assign({}, this.docForm.value);
    delete colneObj.approvers;
    delete colneObj.reviewers;
    delete colneObj.properties;
    var jsonBasicDetails = JSON.stringify([colneObj]);
    var jsonApprovers = JSON.stringify(this.docForm.value.approvers);
    var jsonReviewers = JSON.stringify(this.docForm.value.reviewers);
   // var jsonProperties = JSON.stringify(this.docForm.value.properties);
    var jsonProperties = JSON.stringify(this.docForm.value.properties);
    var jsonRoles = JSON.stringify(this.docForm.value.roles);
    var jsonUsers = JSON.stringify(this.docForm.value.users);
    
    // var formData = {
    //   "document_id":this.id,
    //   "jsonBasicDetails": jsonBasicDetails, "jsonApprovers": jsonApprovers, "jsonReviewers": jsonReviewers,
    //   "jsonProperties": jsonProperties,
    //   "task_documents":this.documents,
    //   "jsonRoles":jsonRoles,
    //   "jsonUsers":jsonUsers
    // }
     //console.log(formData);
    // return ;
    console.log(this.docForm.value);
    //return
    let input = new FormData();
    input.append('doc_basic_details', jsonBasicDetails );
    input.append('approvers', jsonApprovers);
    input.append('reviewers', jsonReviewers);
    input.append('created_by', this.docForm.value.created_by);
    input.append('path_ids', this.docForm.value.path_ids);
    input.append('parent_id', this.docForm.value.parent_id);
    input.append('document_id', this.id);
    input.append('doc_properties', jsonProperties);
    input.append('doc_roles', jsonRoles);
    input.append('doc_users', jsonUsers);
    
    for(var i=0;i<this.files.length;i++){
      input.append('documents[]',this.files[i]);
    }
    console.log(this.docForm.value);

    if (this.docForm.valid) {
      this.SpinnerService.show();
      this.documentApiService.addDocumentRevision(input).subscribe(
        data => {
          this.SpinnerService.hide();
            this.toastService.show('Your file has been uploaded', {
              classname: 'bg-success text-light',
            });
             this.router.navigate(['/document-management']);
        },
        err => {
        })
    }
  }
  get f() {
    return this.docForm.controls;
  }
  clickHandler(event: any) {
    // console.log(this.treeComponent.treeModel.focusedNode.data);
     
 }

  getDocumentTree(){
  
  }
  toggleExpanded(event:any){
  
  
  }
  // Drop file
  files: File[] = [];

  onSelect(event) {
    console.log(event);
   
    this.files.push(...event.addedFiles);
    if(this.files && this.files.length >=2) {
      this.onRemove(this.files[0]);
    }
    console.log(this.files);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  //! Drop file

    // Approver box
    addApprover(){
      this.newApproverArray.push(this.reviewerList);    
    }
  
    removeApprover(rev, index){
      if(index != 0){
        this.newApproverArray.splice(index, 1);
      }
    }
    
    // Reviwer box
    addReviewer(){
      this.newReviewerArray.push(this.reviewerList);    
    }
  
    removeReviewer(rev, index){
      console.log(index)
      if(index != 0){
        this.newReviewerArray.splice(index, 1);
      }
    }

  onItemSelect(item: any) {
    console.log(item);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }


  // File drop box
  // public dropped(files: NgxFileDropEntry[]) {
  //   this.files = files;
  //   for (const droppedFile of files) {

  //     if (droppedFile.fileEntry.isFile) {
  //       const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
  //       fileEntry.file((file: File) => {

  //         console.log(droppedFile.relativePath, file);

  //       });
  //     } else {
  //       const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
  //       console.log(droppedFile.relativePath, fileEntry);
  //     }
  //   }
  // }

  public fileOver(event){
    console.log(event);
  }

  public fileLeave(event){
    console.log(event);
  }

  docData;
  selectedProps=[];
  getDocumentDetailsById(){
    var _this = this;
    var formdata = {
      id:this.id,
      user_id:this.localStorageService.getValue().userId,
      property_ids:this.localStorageService.getValue().propertyIds,
      customer_id:this.localStorageService.getValue().customerId,
      user_type:this.localStorageService.getValue().userType
    }
    this.documentApiService.getDocumentDetailsById(formdata).subscribe(
      data => {
      console.log(data);
      
      if((<any>data).length > 0){
        let resData = data[0];
        _this.selectedProps=[];
        // var arrIds = resData.property_ids.split(',');
        // _this.propertyList.map(x => {
        //     console.log(x,arrIds.includes(x.id.toString()),arrIds);
            
        //     if(arrIds.includes(x.id.toString()) ){
        //       _this.selectedIds.push(x);
        //       console.log(_this.selectedIds);
        //     }
        //   })
        resData.doc_properties = JSON.parse(resData.doc_properties);
        resData.doc_roles = JSON.parse(resData.doc_roles);
        resData.doc_users = JSON.parse(resData.doc_users);
        // resData.properties.map(x=>{
        //   _this.selectedProps.push({
        //     "id": x.id,
        //     "property_name": x.
        // });
        // })
       
        this.docData = resData;
           _this.docForm.patchValue({
          // role_name: resData.role_name,
          // role_description : resData.role_description,
          // properties:_this.selectedIds

          expiry_date: {
            "year": new Date(resData.expiry_date).getFullYear(),
            "month":new Date(resData.expiry_date).getMonth(),
            "day": new Date(resData.expiry_date).getDay()
        },
         remarks: resData.remarks,

         version:parseFloat((parseFloat(parseFloat(resData.revision).toFixed(1) )  + 0.1).toFixed(10)) ,
         properties:resData.doc_properties
        
    //  //properties: [this.selectedProperties],
    //  properties: [this.selectedProperties, Validators.required],
    //  roles: [this.selectedRoles, Validators.required],
    //  users: [this.selectedUsers, Validators.required],
    //  approvers: this.formBuilder.array([this.createItemApprovers()]),
    //  reviewers: this.formBuilder.array([this.createItemReviewers()])
        });
       
        setTimeout(function(){ 
          _this.onPropertyChange(2);
      }, 1000);
        // _this.docForm.patchValue({
        //   users:resData.doc_users
        // })
        //this.onRoleChange();
     
      // formatDate(x.start_date, 'd MMM y', 'en-US');
      }
     // this.docData = data;

      },
      err=>{})
  }
  revisionChange(e){
    console.log(e.target.value);
    if(e.target.value == 1){

      this.docForm.patchValue({
      version :(parseInt(this.docData.revision)+ 1).toFixed(1)
      })
    }
    else{
      
      this.docForm.patchValue({
        version :parseFloat((parseFloat(parseFloat(this.docData.revision).toFixed(1) )  + 0.1).toFixed(10))
       // parseFloat(parseFloat(this.docData.revision).toFixed(1) ) +parseFloat(parseFloat('0.1').toFixed(1))
        })
    }
  }
}

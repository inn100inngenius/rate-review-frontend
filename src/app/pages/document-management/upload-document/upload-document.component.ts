import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ScriptService } from '@app/_services/script.service';
import { AppService } from '@app/app.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DocumentApiService } from '../document-api.service';
import { ITreeOptions, TreeComponent, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { ToastService } from '../../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LocalStorageService } from '@app/_services';
import { TaskApiService } from '@app/pages/task-management/task-api.service';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css'],
  providers:[ScriptService]
})
export class UploadDocumentComponent implements OnInit {
  docForm: FormGroup;
  submitted = false;
  submitted1 = false;
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
  model: any = {};
  
  @ViewChild('tree') treeComponent: TreeComponent;
  @ViewChild('tree1') treeComponent1: TreeComponent;
  nodes = [
    {
      id: 0,
      node_type: 1,
      node_name: 'Public',
      isExpanded: true,
      count: 10,
      parent_id : null,
      children: [
        
      ]
    }
  ];
  nodes1 = [
    {
      id: 0,
      node_type: 1,
      node_name: 'Public',
      isExpanded: true,
      count: 10,
      parent_id : null,
      children: [
        
      ]
    }
  ];
  pathIds=[];
  parentId = null;
  parentId1;
  //options = {};
  options: ITreeOptions = {
    actionMapping: {
        mouse: {
            click: (tree, node, $event) => {
              TREE_ACTIONS.ACTIVATE(tree, node, $event);
              console.log($($event.target));
              $($event.target).parent().parent()[0].style.background = "#b1bbff";
                const lineage = [];
                this.pathIds = [];
                // add clicked node as first item
                lineage.push(node.data);
                this.pathIds.push(node.data);
                this.parentId=node.data;
                this.treeComponent.treeModel.setFocusedNode(node.data.id);
                // grab parent of clicked node
                let parent = node.parent;

                // loop through parents until the root of the tree is reached
                while(parent !== null){
                 
                    lineage.push(parent.data);
                    this.pathIds.push(parent.data);
                    parent = parent.parent;
                    
                }
                
            }
        }
    }
}
options1: ITreeOptions = {
  actionMapping: {
      mouse: {
          click: (tree, node, $event) => {
            TREE_ACTIONS.ACTIVATE(tree, node, $event);
              const lineage = [];
              this.pathIds = [];
              // add clicked node as first item
              lineage.push(node.data);
              this.pathIds.push(node.data);
              this.parentId1=node.data;
              // grab parent of clicked node
              let parent = node.parent;

              // loop through parents until the root of the tree is reached
              while(parent !== null){
                  lineage.push(parent.data);
                  this.pathIds.push(parent.data);
                  parent = parent.parent;
                  
              }
              
          }
      }
  }
}
  constructor( private route: ActivatedRoute,
    private router: Router,private script:ScriptService,    
    public appService: AppService, private formBuilder: FormBuilder,
    private documentApiService : DocumentApiService,
    public toastService: ToastService, 
    private SpinnerService: NgxSpinnerService,
    private taskApiService: TaskApiService,
    private localStorageService:LocalStorageService) {
      this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {
           // this.getFormData();
          }
          // this.setBreadcrumb();
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
  toggleExpanded1(event:any){

    if(event.isExpanded){
      var data = {node_id : event.node.data.id,
        user_id : this.localStorageService.getValue().userId,
        user_type : this.localStorageService.getValue().userType,
        property_ids : this.localStorageService.getValue().propertyIds};
      this.documentApiService.getDocumentTree(data).subscribe(
        data => {
         this.treeComponent1.treeModel.getNodeById(event.node.data.id).data.children = [];
         data.map(x=>{
           if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
           {
            x["children"] = [{}];
           }
           if(x.node_type == 1){
            x["isExpanded"] = false;
            this.treeComponent1.treeModel.getNodeById(event.node.data.id).data.children.push(x);
          }
          
         })
         this.treeComponent1.treeModel.update();
        },
        err=>{})
    
    }
    }
    addFolder(){
      let pathStr = "";
      this.pathIds.slice(0).reverse().map(x=>{
        if(x.node_name)
        {pathStr = pathStr + x.node_name + '/';}
      })
      
      this.submitted1 = true;
          if(this.model.folder_name && this.model.folder_name.trim() != ""){
            if(this.parentId1 == undefined){
              this.toastService.show('Select a folder', {
                classname: 'bg-danger text-light',
              });
            }
            else{
          let propertyIds = this.model.properties.map(x=> x.id)
          this.model.property_ids = propertyIds.toString();
          this.model.created_by = this.localStorageService.getValue().userId;
          //this.model.created_by = localStorage.getItem("userId");
          this.model.path_ids = pathStr ;
          this.model.parent_id = this.parentId1.id;
          this.SpinnerService.show();
          this.documentApiService.createFolder(this.model).subscribe(
            data => {
              this.SpinnerService.hide();
              this.model.comment="";
              
              if(data.success){
               // Swal.fire('Success', 'Folder Created', 'success');
                this.toastService.show('Folder Created', {
                  classname: 'bg-success text-light',
                });
              }
              else{
                this.toastService.show('Folder Name Already Exists', {
                  classname: 'bg-danger text-light',
                });
                //Swal.fire('Error', '', 'error');
              }
             // Swal.fire('Oops...', 'Something went wrong!', 'error')
            },
            err=>{})
          }
          }
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
  onPropertyChange() {
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
    this.onPropertyChange();
  }
  onPropertyDeSelectAll() {
    this.docForm.patchValue({
      roles: [],
      users: []
    });
    this.roleList = [];
  }
  onRoleChange() {
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
  }
  onRoleSelectAll() {
    this.docForm.patchValue({
      roles: this.roleList
    });
    this.onRoleChange();
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
    let pathStr = "";
    let pathIdStr = [];
    this.pathIds.slice(0).reverse().map(x=>{
      if(x.node_name)
      { console.log(x);
        pathIdStr.push(x.id);
        pathStr = pathStr + x.node_name + '/';}
    })
    console.log(pathIdStr.toString());
    this.docForm.value.created_by =this.localStorageService.getValue().userId; 
    this.docForm.value.path_ids = pathStr ;
    this.docForm.value.path_ids_str = pathIdStr.toString() ;
    this.docForm.value.parent_id = this.parentId.id;

   // console.log(this.docForm.value);
    if (this.id === undefined) {
      this.saveRecord();
    }
    else {
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
    //   "jsonBasicDetails": jsonBasicDetails, "jsonApprovers": jsonApprovers, "jsonReviewers": jsonReviewers,
    //   "jsonProperties": jsonProperties,
    //   "task_documents":this.documents,
    //   "jsonRoles":jsonRoles,
    //   "jsonUsers":jsonUsers
    // }
    // console.log(formData);
    // return ;
    let input = new FormData();
    input.append('doc_basic_details', jsonBasicDetails );
    input.append('approvers', jsonApprovers);
    input.append('reviewers', jsonReviewers);
    input.append('created_by', this.docForm.value.created_by);
    input.append('path_ids', this.docForm.value.path_ids);
    input.append('parent_id', this.docForm.value.parent_id);

    input.append('doc_properties', jsonProperties);
    input.append('doc_roles', jsonRoles);
    input.append('doc_users', jsonUsers);
    
    for(var i=0;i<this.files.length;i++){
      input.append('documents[]',this.files[i]);
    }
    console.log(this.docForm.value);

    if (this.docForm.valid) {
      this.SpinnerService.show();
      this.documentApiService.addNewDocuments(input).subscribe(
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
    var data = {node_id : 0,user_id : this.localStorageService.getValue().userId,
      user_type : this.localStorageService.getValue().userType,
      property_ids : this.localStorageService.getValue().propertyIds};
    this.documentApiService.getDocumentTree(data).subscribe(
      data => {
        console.log(data);
       data.map(x=>{
        if(x.node_type == 1){
         if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
         {
          x["children"] = [{}];
         }
        //  x.f_name = x.node_name;
        //  let resArray = x.node_name.split(".");
        //  resArray.splice(resArray.length - 2, 1);
        //  x.node_name  = resArray.join('.');
         this.nodes1[0].children.push(x);
        //  this.nodes1[0].count =  data.length;
          this.nodes[0].children.push(x);
        }
       
       
       })
       
       this.treeComponent.treeModel.update();
       this.treeComponent1.treeModel.update();
      },
      err=>{})
  }

  // getDocumentTree(){
  //   var _this = this;
  //   var data = {node_id : 0};
  //   this.getAllDocumentsByParentId(0);
  //   this.documentApiService.getDocumentTree(data).subscribe(
  //     data => {
  //       _this.foldersOnly=[];
  //      data.map(x=>{
  //        if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
  //        {
  //         x["children"] = [{}];
  //        }
  //        if(x.node_type == 2){
  //         x.f_name = x.node_name;
  //         let resArray = x.node_name.split(".");
  //         resArray.splice(resArray.length - 2, 1);
  //         x.node_name  = resArray.join('.');
  //       }
  //       else{
  //         _this.foldersOnly.push(x);
  //         this.nodes1[0].children.push(x);
  //         this.nodes1[0].count =  data.length;
  //       }
         
  //       this.nodes[0].children.push(x);

  //      })
  //      this.nodes[0].count = data.length;
       
  //      let docsData = {'documents':_this.documentsOnly,'folders':_this.foldersOnly,'parent_id':0};
  //      this.documentSidemenuService.changeMessage(docsData);
  //      this.treeComponent.treeModel.update();
  //      this.treeComponent1.treeModel.update();
  //      console.log(this.nodes)
  //     },
  //     err=>{})
  // }
  toggleExpanded(event:any){
  
  if(event.isExpanded){
    var data = {node_id : event.node.data.id,user_id : this.localStorageService.getValue().userId,
      user_type : this.localStorageService.getValue().userType,
      property_ids : this.localStorageService.getValue().propertyIds};
    this.documentApiService.getDocumentTree(data).subscribe(
      data => {
       this.treeComponent.treeModel.getNodeById(event.node.data.id).data.children = [];
      // this.treeComponent.treeModel.getNodeById(event.node.data.id).data.isExpanded = false;
       data.map(x=>{
        if(x.node_type == 1){
         
         if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
         {
          x["children"] = [{}];
         }
         x["isExpanded"] = false;
         this.treeComponent.treeModel.getNodeById(event.node.data.id).data.children.push(x);
        }
       })
       
       this.treeComponent.treeModel.update();
      },
      err=>{})
  
  }
  }
  // Drop file
  files: File[] = [];

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
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
  onPropertyChange1(evType){
    if(evType == 4){
      this.model.properties = [];
      //this.getAllTasks();
    }
    else if(evType == 3){
      this.model.properties =  this.propertyList;
      //this.getAllTasks();
    }
    else{
     // this.getAllTasks();
    }
    console.log(this.model);
  }
}

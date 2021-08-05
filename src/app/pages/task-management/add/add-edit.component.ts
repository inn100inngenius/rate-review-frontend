import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ScriptService } from '@app/_services/script.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { AppService } from '@app/app.service';
import { TaskApiService } from '../task-api.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastService } from '../../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
  providers: [ScriptService]

})
export class AddEditComponent implements OnInit {

  htmlContent: '';

  id: string
  data: any
  taskForm: FormGroup;
  // public files: NgxFileDropEntry[] = [];
  documents = [];
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
  approvers: FormArray;
  reviewers: FormArray;
  selectedApprovers = [];
  selectedReviewers = [];

  taskStatus: number;
  attachType = 0;
  model: NgbDateStruct;

  submitted = false;

  newApproverArray = [];
  newReviewerArray = [];
  count: number;
  selectVal: any = [];

  approverList: Array<any> = []

  reviewerList: any = []

  // Drop file
  files: File[] = [];

    onSelect(event) {
      console.log(event);
      this.files.push(...event.addedFiles);
    }

    onRemove(event) {
      console.log(event);
      this.files.splice(this.files.indexOf(event), 1);
    }
    //! Drop file

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '170px',
      maxHeight: '170px',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};


  constructor(private route: ActivatedRoute,
    private router: Router,
    private script: ScriptService,
    private formBuilder: FormBuilder,
    public appService: AppService,
    private taskApiService: TaskApiService,
    public toastService: ToastService, 
    private SpinnerService: NgxSpinnerService,
    private localStorageService:LocalStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {
            this.getFormData();
          }
          // this.setBreadcrumb();
        }
      );

  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      task_title: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
      task_description: ['', Validators.required],
      priority: ['', Validators.required],
      intervals: [''],
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
    this.count = 0;
    console.log(this.newReviewerArray);
    // Property
    this.getAllProperties()
    this.getRolesByPropertyId()
    this.getUsersByPropertyAndRoleId()

  }

  changeApprover() {
    this.selectedApprovers = this.taskForm.value.approvers.map(x => x.approver);
  }
  get formArr() {
    return this.taskForm.get('approvers') as FormArray;
  }
  createItemApprovers(): FormGroup {
    return this.formBuilder.group({
      approver: ['', Validators.required],

    });
  }
  addItemApprovers(): void {

    this.approvers = this.taskForm.get('approvers') as FormArray;
    this.approvers.push(this.createItemApprovers());
  }
  removeItemApprovers(index) {

    this.approvers = this.taskForm.get('approvers') as FormArray;
    this.approvers.removeAt(index);
    this.changeApprover();
  }
  changeReviewer() {
    this.selectedReviewers = this.taskForm.value.reviewers.map(x => x.reviewer);
  }
  // get formArr() {
  //   return this.taskForm.get('approvers') as FormArray;
  // }
  createItemReviewers(): FormGroup {
    return this.formBuilder.group({
      reviewer: ['', Validators.required],

    });
  }
  addItemReviewers(): void {

    this.reviewers = this.taskForm.get('reviewers') as FormArray;
    this.reviewers.push(this.createItemReviewers());
  }
  removeItemReviewers(index) {

    this.reviewers = this.taskForm.get('reviewers') as FormArray;
    this.reviewers.removeAt(index);
    this.changeReviewer();
  }


  onSubmit() {
    this.submitted = true;
    if (this.id === undefined) {
      this.saveRecord();
    }
    else {
      this.updateRecord();
    }
  }
  onPropertyChange() {
    this.taskForm.patchValue({
      roles: [],
      users: []
    });
    this.roleList = [];
    let selectedIds = [];
    let selectedValues = {};
    this.taskForm.value.properties.map(itm => {
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
    this.getApproversByPropertyIds(this.taskForm.value.properties);
    this.getReviewersByPropertyIds(this.taskForm.value.properties);

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
    this.taskForm.patchValue({
      properties: this.propertyList
    });
    this.onPropertyChange();
  }
  onPropertyDeSelectAll() {
    this.taskForm.patchValue({
      roles: [],
      users: []
    });
    this.roleList = [];
  }
  onRoleChange() {
    this.taskForm.patchValue({

      users: []
    });
    this.userList = [];
    let userIds = [];
    let selectedValues = {};
    let propertyIds = this.taskForm.value.properties.map(x => x.id);
    let roleIds = this.taskForm.value.roles.map(x => x.id);
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
    this.taskForm.patchValue({
      roles: this.roleList
    });
    this.onRoleChange();
  }
  onRoleDeSelectAll() {
    this.taskForm.patchValue({
      users: []
    });
    this.userList = [];
  }
  onUserSelect(item: any) {
  }



  get f() {
    return this.taskForm.controls;
  }

  // Save new record 
  saveRecord() {
    var startDateObj = this.taskForm.value.start_date;
    this.taskForm.value.start_date = startDateObj.year + '/' + startDateObj.month + '/' + startDateObj.day;
    var dueDateObj = this.taskForm.value.due_date
    this.taskForm.value.due_date = dueDateObj.year + '/' + dueDateObj.month + '/' + dueDateObj.day;
    // console.log(startDateObj.year +'/'+ startDateObj.month +'/'+ startDateObj.day,this.taskForm.value.start_date )

    this.taskForm.value.created_by = localStorage.getItem('userId');
    let colneObj = Object.assign({}, this.taskForm.value);
    delete colneObj.approvers;
    delete colneObj.reviewers;
    delete colneObj.properties;
    var jsonBasicDetails = JSON.stringify([colneObj]);
    var jsonApprovers = JSON.stringify(this.taskForm.value.approvers);
    var jsonReviewers = JSON.stringify(this.taskForm.value.reviewers);
    var jsonProperties = JSON.stringify(this.taskForm.value.properties);
    var jsonRoles = JSON.stringify(this.taskForm.value.roles);
    var jsonUsers = JSON.stringify(this.taskForm.value.users);
    
    // var formData = {
    //   "task_basic_details": jsonBasicDetails, "approvers": jsonApprovers, "reviewers": jsonReviewers,
    //   "task_properties": jsonProperties, "task_roles": jsonRoles, "task_users": jsonUsers,
    //   "task_documents":this.documents
    // }
    let input = new FormData();
    input.append('task_basic_details', jsonBasicDetails );
    input.append('approvers', jsonApprovers);
    input.append('reviewers', jsonReviewers);
    input.append('task_properties', jsonProperties);
    input.append('task_roles', jsonRoles);
    input.append('task_users', jsonUsers);
    
    for(var i=0;i<this.files.length;i++){
      input.append('task_documents[]',this.files[i]);
    }
   
    // console.log(input);

    console.log(this.taskForm.value);

    if (this.taskForm.valid) {
      this.SpinnerService.show();
      this.taskApiService.addTask(input).subscribe(
        data => {
            this.SpinnerService.hide();
            this.toastService.show('Your task details has been saved', {
              classname: 'bg-success text-light',
            });
            this.router.navigate(['/task-management']);
        },
        err => {
        })
    }
  }

  // Update record 
  updateRecord() {
    if (this.taskForm.valid) {
       this.SpinnerService.show();
      this.taskForm.value.id = this.id;
      var formData = this.taskForm.value;
      var link = `${'Roles/' + this.id}`;
      // this.appService.put("http://localhost:58602/api/Roles", formData, { params: this.id })
      this.appService.put(link, formData)
        .subscribe(
          data => {
            this.SpinnerService.hide();
            this.toastService.show('Your task details has been saved', {
              classname: 'bg-success text-light',
            });
          },
          err => {
          })
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
    this.taskApiService.getAllRoles().subscribe(
      data => {
        console.log(data);
        this.roleListAll = data;
        //this.roleList = data;
      },
      err => {
      })
  }
  getUsersByPropertyAndRoleId() {
    this.taskApiService.getAllUsers().subscribe(
      data => {
        console.log(data);
        this.userListAll = data;
       // this.approverList = data;
        //this.reviewerList = data;
      },
      err => {
      })
  }
  getFormData() {
    var formData = { id: this.id };
    var link = 'Roles';
    this.appService.get(link, formData).subscribe(
      data => {
        this.taskForm.patchValue({
          user_name: data.role_name,
        });
      },
      err => {
      })
  }

  // File drop box
  // public dropped(files: NgxFileDropEntry[]) {
  //   this.files = files;
  //   for (const droppedFile of files) {

  //     if (droppedFile.fileEntry.isFile) {
  //       const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
  //       fileEntry.file((file: File) => {

  //         console.log(droppedFile.relativePath, file);
  //         this.documents.push(file);

  //       });
  //     } else {
  //       const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
  //       console.log(droppedFile.relativePath, fileEntry);
  //     }
  //   }
  // }

  // public fileOver(event) {
  //   console.log(event);
  // }

  // public fileLeave(event) {
  //   console.log(event);
  // }


}

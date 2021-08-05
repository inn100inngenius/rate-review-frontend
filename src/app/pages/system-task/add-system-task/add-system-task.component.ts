import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskApiService } from '@app/pages/task-management/task-api.service';
import Swal from 'sweetalert2';
import { SystemTaskApiService } from '../system-task-api-service';
import {
  NgWizardConfig,
  NgWizardService,
  StepChangedArgs,
  StepValidationArgs,
  STEP_STATE,
  THEME
} from 'ng-wizard';
import { of } from 'rxjs';
import { LocalStorageService } from '@app/_services';


@Component({
  selector: 'app-system-task',
  templateUrl: './add-system-task.component.html',
  styleUrls: ['./add-system-task.component.css']
})
export class AddSystemTaskComponent implements OnInit {
  systemTaskForm: FormGroup;
  submitted = false;
  jsonFormData = "";
  @ViewChild('json') jsonElement?: ElementRef;
  public form: Object = {
    components: []
  };
  showForm = true;
  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.dots,
    toolbarSettings: {
      toolbarExtraButtons: [{
        text: 'Finish',
        class: 'btn btn-info lastStep d-none',
        event: () => {
          this.onSubmit();
        }
      },],
    }
  };
  onChange(event) {
    // this.jsonElement.nativeElement.innerHTML = '';
    // this.jsonElement.nativeElement.appendChild(document.createTextNode(JSON.stringify(event.form, null, 4)));
    this.jsonFormData = JSON.stringify(event.form, null, 0);
    this.jsonData = event.form;
  }

  jsonData = {

  };
  options = {
    builder: {
      advanced: {
        components: {
          file: true
        }
      },
      premium: false,
      // basic: false,
      // data: false,
      // layout:false,
      // layout: false
    }
  };
  selectedProperties = [];
  selectedRoles = [];
  selectedUsers = [];
  approvers: FormArray;
  reviewers: FormArray;
  selectedApprovers = [];
  selectedReviewers = [];
  propertyList = [];
  roleListAll = [];
  userListAll = [];
  approverList = [];
  reviewerList = [];
  roleList = [];
  newApproverArray = [];
  newReviewerArray = [];
  dropdownSettings: any = {};
  dropdownSettingsRole: any = {};
  dropdownSettingsUser: any = {};
  ShowFilter = true;
  userList = [];
  id;
  isAddMode: boolean = false;
  constructor(private formBuilder: FormBuilder, private systemTaskApiService: SystemTaskApiService,
    private taskApiService: TaskApiService,
    private router: Router, private ngWizardService: NgWizardService,
    private route: ActivatedRoute,
    private localStorageService:LocalStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {
            this.isAddMode = false;
          } else {
            this.isAddMode = true;
          }

        }
      );
  }

  ngOnInit(): void {
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

    this.systemTaskForm = this.formBuilder.group({
      // form_title:['',Validators.required],
      task_title: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
      // task_description: ['', Validators.required],
      priority: ['', Validators.required],
      intervals: [''],
      properties: [this.selectedProperties, Validators.required],
      roles: [this.selectedRoles, Validators.required],
      users: [this.selectedUsers, Validators.required],
      approvers: this.formBuilder.array([this.createItemApprovers()]),
      reviewers: this.formBuilder.array([this.createItemReviewers()])
    });
    this.getAllProperties();
    this.getRolesByPropertyId();
    this.getUsersByPropertyAndRoleId();
  }
  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    if (args.step.index == 1) {
      document.querySelector('.lastStep').classList.remove('d-none');
    } else {
      document.querySelector('.lastStep').classList.add('d-none');
    }
  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }
  get f() {
    return this.systemTaskForm.controls;
  }
  saveRecord() {
    var startDateObj = this.systemTaskForm.value.start_date;
    this.systemTaskForm.value.start_date_str = startDateObj.year + '/' + startDateObj.month + '/' + startDateObj.day;
    var dueDateObj = this.systemTaskForm.value.due_date
    this.systemTaskForm.value.due_date_str = dueDateObj.year + '/' + dueDateObj.month + '/' + dueDateObj.day;
    // console.log(startDateObj.year +'/'+ startDateObj.month +'/'+ startDateObj.day,this.taskForm.value.start_date )
    this.systemTaskForm.value.created_by = localStorage.getItem('userId');
    this.systemTaskForm.value.form_data = this.jsonFormData.toString();
    let colneObj = Object.assign({}, this.systemTaskForm.value);
    delete colneObj.approvers;
    delete colneObj.reviewers;
    delete colneObj.properties;

    var jsonBasicDetails = JSON.stringify([colneObj]);
    var jsonApprovers = JSON.stringify(this.systemTaskForm.value.approvers);
    var jsonReviewers = JSON.stringify(this.systemTaskForm.value.reviewers);
    // var jsonApprovers = JSON.stringify(this.selectedApproverPropertyRole);
    //var jsonReviewers = JSON.stringify(this.selectedReviewerPropertyRole);

    var jsonProperties = JSON.stringify(this.systemTaskForm.value.properties);
    var jsonRoles = JSON.stringify(this.systemTaskForm.value.roles);
    var jsonUsers = JSON.stringify(this.systemTaskForm.value.users);

    console.log(this.selectedApproverPropertyRole);

    //var jsonSelectedUsers =JSON.stringify(this.selectedUsersRolesProperties);

    var formData = {
      "task_basic_details": jsonBasicDetails, "task_approvers": jsonApprovers,
      "task_reviewers": jsonReviewers,
      "task_users": jsonUsers, "form_data": this.jsonFormData.toString(),
      "task_properties": jsonProperties, "task_roles": jsonRoles
    }
    console.log(formData, this.systemTaskForm.valid, this.jsonFormData.toString());
    //return;
    if (this.systemTaskForm.valid && this.jsonFormData.toString() != "") {
      // console.log(this.systemTaskForm.value);
      this.systemTaskApiService.addSystemTask(formData).subscribe(
        data => {
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Your system task has been saved',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/system-tasks']);
          })
        },
        err => {
        })
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.id === undefined) {
      this.saveRecord();
    } else {
      this.updateRecord();
    }
  }

  updateRecord() {
  }

  selectedApproverPropertyRole = [];

  changeApprover() {
    this.selectedApproverPropertyRole = [];
    this.selectedApprovers = this.systemTaskForm.value.approvers.map(x => x.approver);
    this.approverList.map(x => {
      this.systemTaskForm.value.approvers.map(y => {
        if ((x.user_id + '_' + x.role_id + '_' + x.property_id).toString() == y.approver) {
          this.selectedApproverPropertyRole.push(x);
        }
      })
    })
  }

  get formArr() {
    return this.systemTaskForm.get('approvers') as FormArray;
  }

  createItemApprovers(): FormGroup {
    return this.formBuilder.group({
      approver: ['', Validators.required],

    });
  }

  addItemApprovers(): void {
    this.approvers = this.systemTaskForm.get('approvers') as FormArray;
    this.approvers.push(this.createItemApprovers());
  }

  removeItemApprovers(index) {
    this.approvers = this.systemTaskForm.get('approvers') as FormArray;
    this.approvers.removeAt(index);
    this.changeApprover();
  }

  selectedReviewerPropertyRole = [];
  changeReviewer() {
    this.selectedReviewerPropertyRole = [];
    this.selectedReviewers = this.systemTaskForm.value.reviewers.map(x => x.reviewer);
    this.approverList.map(x => {
      this.systemTaskForm.value.reviewers.map(y => {
        if ((x.user_id).toString() == y.reviewer) {
          this.selectedReviewerPropertyRole.push(x);
        }
      })
    })
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

    this.reviewers = this.systemTaskForm.get('reviewers') as FormArray;
    this.reviewers.push(this.createItemReviewers());
  }
  removeItemReviewers(index) {

    this.reviewers = this.systemTaskForm.get('reviewers') as FormArray;
    this.reviewers.removeAt(index);
    this.changeReviewer();
  }
  getAllProperties() {
    var formData = {user_id:this.localStorageService.getValue().userId,
      user_type:this.localStorageService.getValue().userType,
    customer_id:this.localStorageService.getValue().customerId
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
        //this.approverList = data;
        //this.reviewerList = data;
      },
      err => {
      })
  }
  getApproversByPropertyIds(itm) {

    var names = itm.map(function (item) {
      return item['id'];
    });
    let data = { "property_ids": names.toString() }
    this.systemTaskApiService.getApproversByPropertyIds(data).subscribe(
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

    var names = itm.map(function (item) {
      return item['id'];
    });
    let data = { "property_ids": names.toString() }
    this.systemTaskApiService.getReviewersByPropertyIds(data).subscribe(
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
  onPropertyChange() {
    this.systemTaskForm.patchValue({
      roles: [],
      users: []
    });
    this.roleList = [];
    let selectedIds = [];
    let selectedValues = {};
    this.systemTaskForm.value.properties.map(itm => {
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
    this.getApproversByPropertyIds(this.systemTaskForm.value.properties);
    this.getReviewersByPropertyIds(this.systemTaskForm.value.properties);

  }

  onPropertySelectAll() {
    this.systemTaskForm.patchValue({
      properties: this.propertyList
    });
    this.onPropertyChange();
  }
  onPropertyDeSelectAll() {
    this.systemTaskForm.patchValue({
      roles: [],
      users: []
    });
    this.roleList = [];
    this.userRolesProperties = [];
  }
  userRolesProperties = [];
  onRoleChange() {
    this.systemTaskForm.patchValue({

      users: []
    });
    this.userList = [];
    this.userRolesProperties = [];
    let userIds = [];
    let selectedValues = {};
    let propertyIds = this.systemTaskForm.value.properties.map(x => x.id);
    let roleIds = this.systemTaskForm.value.roles.map(x => x.id);
    this.userListAll.map(x => {
      let roles_properties = JSON.parse(x.roles_properties);
      roles_properties.map(itm => {
        if (propertyIds.includes(itm.property) && roleIds.includes(itm.role)) {
          this.userRolesProperties.push({ 'user_id': x.user_id });
          console.log(this.userRolesProperties);
          if (!userIds.includes(x.user_id)) {
            userIds.push(x.user_id);
            this.userList.push({ user_id: x.user_id, user_name: x.user_name })
          }
        }
      })
    })
  }
  onRoleSelectAll() {
    this.systemTaskForm.patchValue({
      roles: this.roleList
    });
    this.onRoleChange();
  }
  onRoleDeSelectAll() {
    this.systemTaskForm.patchValue({
      users: []
    });
    this.userList = [];
    this.userRolesProperties = [];
  }
  selectedUsersRolesProperties = [];
  onUserChange() {
    this.selectedUsersRolesProperties = [];
    console.log(this.systemTaskForm.value.users);
    this.userRolesProperties.filter(x => {
      this.systemTaskForm.value.users.map(itm => {
        if (x.user_id == itm.user_id) {
          this.selectedUsersRolesProperties.push(x);
        }
      })
    })
    console.log(this.selectedUsersRolesProperties);
  }
  onUserSelectAll() {
    this.systemTaskForm.patchValue({
      users: this.userList
    });
    this.onUserChange();
  }
  onUserDeSelectAll() {
    this.systemTaskForm.patchValue({
      users: []
    });
    this.selectedUsersRolesProperties = [];

  }

}

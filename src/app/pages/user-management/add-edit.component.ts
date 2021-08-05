import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppService } from '@app/app.service';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { ToastService } from '../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./user-management.component.css'],
  providers: [ScriptService]

})
export class AddEditComponent implements OnInit {


  id: string
  data: any
  userRegisterForm: FormGroup;
  submitted = false;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  roleList: any = [];
  propertyList:any =[];
  isAddMode:boolean = false;
  items: FormArray;
  roleListAll =[];
  userId;userType;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private script: ScriptService,
    private formBuilder: FormBuilder,
    public appService: AppService,
    public toastService: ToastService, 
    private SpinnerService: NgxSpinnerService,
    private localStorageService:LocalStorageService) {

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {
           
           
            this.isAddMode = false;
          }
          else{
            this.isAddMode = true;
          }
          this.setBreadcrumb();
        }
      );
    
  }
 
  ngOnInit(): void {
    
    this.getAllRoles();
   this.getAllProperties();
    this.userRegisterForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      user_name: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      user_password: [''],
      // roles: ['', Validators.required],
      // properties: ['', Validators.required],
      items: this.formBuilder.array([ this.createItem() ])
    });
    if(this.id === undefined) {
      this.userRegisterForm.get('user_password').setValidators(Validators.required);
  } 
 

    this.dropdownList = [
      { "id": 1, "itemName": "Property 1" },
      { "id": 2, "itemName": "Property 2" },
      { "id": 3, "itemName": "Property 3" },
      { "id": 4, "itemName": "Property 4" },
      { "id": 5, "itemName": "Property 5" },
      { "id": 6, "itemName": "Property 6" },
      { "id": 7, "itemName": "Property 7" },
      { "id": 8, "itemName": "Property 8" },
      { "id": 9, "itemName": "Property 9" },
      { "id": 10, "itemName": "Property 10" }
    ];
    this.selectedItems = [
      { "id": 2, "itemName": "Property 2" },
      { "id": 3, "itemName": "Property 3" },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Properties",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
  }
  get formArr() {
    return this.userRegisterForm.get('items') as FormArray;
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      roles: ['', Validators.required],
      properties: ['', Validators.required],
     
    }); 
  }
  addItem(): void {
  
    this.items = this.userRegisterForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  removeItem(index) {
   
    this.items = this.userRegisterForm.get('items') as FormArray;
    this.items.removeAt(index);
  }
  setBreadcrumb() {
    let page = this.id === undefined ? 'Add User' : 'Update User';
    let breadcrumbData = [
      { 'page': 'home', 'path': '/home' },
      { 'page': 'Customer Management', 'path': '/customer/dashboard' },
      { 'page': 'User Management', 'path': '/user-management' },
      { 'page': page, 'path': '' }
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
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

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }

  get f() {
    return this.userRegisterForm.controls;
  }
  onPropertyChange(ev,i){
    let propertyId = ev.value;
    // this.userRegisterForm.patchValue({
    //   roles:[],
    //   users:[]
    // });
  this.roleList[i] = [];
  let selectedIds = [];
  let selectedValues = {};
  
    this.roleListAll.map(x => {
      if (x.property_ids.split(',').includes(propertyId.toString())) {
        if (!selectedIds.includes(x.id)) {
          selectedIds.push(x.id)
          selectedValues[x.id] = Object.assign({}, x);
          //this.roleList.push(x);
        }
       
      }
    })

    this.roleList[i] =  Object.values(selectedValues).map((itm, i) => {
      return itm;
    });
    // this.items = this.userRegisterForm.get('items') as FormArray;
    // this.items.get(i.toString()).patchValue({roles:undefined})
   // this.selectedClasses = this.items.value.map(itm=>itm.class);
  }

  // Save new record 
  saveRecord() {
    //this.userRegisterForm.value.created_by = localStorage.getItem('userId');
    this.userRegisterForm.value.created_by =this.localStorageService.getValue().userId,
    this.userRegisterForm.value.user_type =this.localStorageService.getValue().userType,
    this.userRegisterForm.value.customer_id =this.localStorageService.getValue().customerId ; 


    var jsonRoleProp =JSON.stringify(this.userRegisterForm.value.items);
    let colneObj = Object.assign({}, this.userRegisterForm.value);
    delete colneObj.items;
    //var jsonGeneral = JSON.stringify(colneObj);
    var formData = {
      "user_roles_properties":jsonRoleProp,"general_details":colneObj}
    console.log(this.userRegisterForm.controls);
    console.log(formData);
    
    if (this.userRegisterForm.valid) {
       this.SpinnerService.show();
      var link = 'Users';
      this.appService.post(link, formData).subscribe(
        data => {
          if(data.success)
          { 
            this.SpinnerService.hide();
            this.toastService.show('Your data has been updated', {
              classname: 'bg-success text-light',
            });
            this.router.navigate(['/user-management']);
        }
        else{
             this.SpinnerService.hide();
             this.toastService.show(data.error, {
              classname: 'bg-danger text-light',
            });
        }
        },
        err => {
        })
    }
  }
  // Update record 
  updateRecord() {
    
    this.userRegisterForm.value.id = this.id;
    this.userRegisterForm.value.created_by =this.localStorageService.getValue().userId;
    var jsonRoleProp =JSON.stringify(this.userRegisterForm.value.items);
    let colneObj = Object.assign({}, this.userRegisterForm.value);
    delete colneObj.items;
    //var jsonGeneral = JSON.stringify(colneObj);
    var formData = {"user_roles_properties":jsonRoleProp,"general_details":colneObj}
    console.log(this.userRegisterForm.controls);
    console.log(formData);
    if (this.userRegisterForm.valid) {
     
     
      var link = `${'Users/' + this.id}`;
      // this.appService.put("http://localhost:58602/api/Roles", formData, { params: this.id })
      this.appService.put(link, formData)
        .subscribe(
          data => {
            if(data.success)
            {
              this.SpinnerService.hide();
              this.toastService.show('Your data has been updated', {
                classname: 'bg-success text-light',
              });
              this.router.navigate(['/user-management']);
          }else{
            this.SpinnerService.hide();
             this.toastService.show(data.error, {
              classname: 'bg-danger text-light',
            });
          }
          },
          err => {
          })
    }
  }

  getFormData() {
    var formData = { id: this.id };
    var link = 'Users';
    var _this = this;
    this.appService.get(link, formData).subscribe(
      data => {
        if(data.length > 0){
          let reqData = data[0];
          this.userRegisterForm.patchValue({
            user_name: reqData.user_name,
            first_name: reqData.first_name,
            last_name: reqData.last_name,
            user_email:reqData.user_email,
            user_password: reqData.user_password,
            roles:reqData.roles,
            properties:reqData.properties,
          });
         
          let arr = JSON.parse(reqData.roles_properties);
          console.log(arr);
          let control = this.userRegisterForm.get('items') as FormArray;
          while (control.length) {
              control.removeAt(0);
          }
          _this.items =arr;
         let propertyValue = [];
          arr.forEach((x,i)=>{
              control.push(this.formBuilder.group({
                  roles: x.role,
                  properties: x.property
              }));
               propertyValue['value'] = x.property;
              this.onPropertyChange(propertyValue, i)
          });
        }
      },
      err => {
      })
  }

  getAllRoles() {
    var formData = {};
    var link = 'Roles/GetAllRoles';
    this.appService.get(link, formData).subscribe(
      data => {
        this.roleListAll = data;
        if (this.id) {
          this.getFormData();
        }
        
      },
      err => {
      })
  }
  getAllProperties() {
    
    var formData = {user_id:this.localStorageService.getValue().userId,
      user_type:this.localStorageService.getValue().userType,
    customer_id:this.localStorageService.getValue().customerId
  };
    var link = 'Properties/GetAllProperties';
    this.appService.get(link, formData).subscribe(
      data => {
        this.propertyList = data;
      },
      err => {
      })
  }
  onReset() {
    this.submitted = false;
    this.userRegisterForm.reset();
  }



}

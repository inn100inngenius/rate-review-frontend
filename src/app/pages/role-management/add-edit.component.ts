import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService,LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { AppService } from '@app/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastService } from '../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./role-management.component.css'],
  providers:[ScriptService]
})

export class AddEditComponent implements OnInit {
  id: string
  data: any
  roleRegisterForm: FormGroup;
  submitted = false;
  propertyList =[];
  ShowFilter = true;
  limitSelection = true;
  
  selectedItems = [];
  dropdownSettings: any = {};

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private script:ScriptService, 
    private formBuilder: FormBuilder, 
    public appService: AppService,
    public http:HttpClient,
    public toastService: ToastService, 
    private SpinnerService: NgxSpinnerService,
    private localStorageService:LocalStorageService
    ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];   
          if(this.id ){
            
          }      
          this.setBreadcrumb();
        }
      );
      // this.script.load().then(data => {
      // console.log('script loaded ', data);
      // }).catch(error => console.log(error));
      
  }
  
  setBreadcrumb(){
    
    let page = this.id === undefined ? "Add Role":"Update Role";
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer/dashboard'},
      {'page':'Role Management','path':'/role-management'},
      {'page':page,'path':''},
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }
  userType;
  userId;
  ngOnInit(): void {
//console.log(this.localStorageService.getValue().userId);

  
    
    this.getAllProperties();
   
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'property_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    };
    this.roleRegisterForm = this.formBuilder.group({
      properties:[this.selectedItems,Validators.required],
      role_name: ['', Validators.required],
      role_description: ['', Validators.required]
    });
   
  
  }
 
  onItemSelect(item: any) {
    console.log('onItemSelect', item);
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }
  onSubmit() {
   
    this.submitted = true;
    if(this.id === undefined){
      this.saveRecord();
    }
    else{
      this.updateRecord();
    }
  }

  get f() { 
    return this.roleRegisterForm.controls; 
  }

  onReset() {
    this.submitted = false;
    this.roleRegisterForm.reset();
  }

    // Save new record 
    saveRecord() {
     var propertyIds =this.roleRegisterForm.value.properties.map(x => x.id );
     this.roleRegisterForm.value.property_ids = propertyIds.toString();
     console.log(this.roleRegisterForm.value);
    if (this.roleRegisterForm.valid) {
      this.SpinnerService.show();
      this.roleRegisterForm.value.created_by = this.localStorageService.getValue().userId;
      this.roleRegisterForm.value.customer_id = this.localStorageService.getValue().customerId;
     
      var formData = this.roleRegisterForm.value;
        var link = 'Roles';
        
        this.appService.post(link,formData).subscribe(
          data => {
            this.SpinnerService.hide();
            this.toastService.show('Your data has been updated', {
              classname: 'bg-success text-light',
            });
            this.router.navigate(['/role-management']);
        },
      err => {
      })
    }
    }

  // Update record 
  updateRecord() {
    var propertyIds =this.roleRegisterForm.value.properties.map(x => x.id );
     this.roleRegisterForm.value.property_ids = propertyIds.toString();
    if (this.roleRegisterForm.valid) {
       this.SpinnerService.show();
      this.roleRegisterForm.value.id = this.id;
      var formData =this.roleRegisterForm.value;
      var link = `${'Roles/' + this.id}`;
      // this.appService.put("http://localhost:58602/api/Roles", formData, { params: this.id })
       this.appService.put(link,formData)
      .subscribe(
        data => {
            this.SpinnerService.hide();
            this.toastService.show('Your data has been updated', {
              classname: 'bg-success text-light',
            });
            this.router.navigate(['/role-management']); 
       
      },
    err => {
    })
    }
  }
  selectedIds=[];
  getFormData(){
    var _this = this;
   
    var formData = {id: _this.id};
    var link = 'Roles';
    
    _this.appService.get(link,formData).subscribe(
      data => {
        console.log(data);
        
        if(data.length > 0){
          let resData = data[0];
          _this.selectedIds=[];
          var arrIds = resData.property_ids.split(',');
          _this.propertyList.map(x => {
              //console.log(x,arrIds.includes(x.id.toString()),arrIds);
              
              if(arrIds.includes(x.id.toString()) ){
                _this.selectedIds.push(x);
               // console.log(_this.selectedIds);
              }
            })
             _this.roleRegisterForm.patchValue({
            role_name: resData.role_name,
            role_description : resData.role_description,
            properties:_this.selectedIds
          });
         document.getElementById('property').click();
          
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
    var link = 'Properties/getAllProperties';
    this.appService.get(link, formData).subscribe(
      data => {
        this.propertyList = data;
        if(this.id ){
          this.getFormData();
        }  
       
      },
      err => {
      })
  }
}

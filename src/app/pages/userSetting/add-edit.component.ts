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
  styleUrls: ['./userSetting.component.css'],
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

  StateList: any = [];
  CityList: any = [];
  BookingList: any = [];
  HotelList: any = [];
  ExpediaList: any = [];

  BookingTypeList: any = [];
  HotelTypeList: any = [];
  ExpediaTypeList: any = [];
  //propertyList:any =[];
  isAddMode: boolean = false;
  items: FormArray;
  roleListAll = [];
  userId; userType;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private script: ScriptService,
    private formBuilder: FormBuilder,
    public appService: AppService,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    private localStorageService: LocalStorageService) {

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {
            this.isAddMode = false;
          }
          else {
            this.isAddMode = true;
          }
          this.setBreadcrumb();
        }
      );

  }

  ngOnInit(): void {

    this.getStateList();
    this.getAllProperties();
    this.userRegisterForm = this.formBuilder.group({
      HotelName: ['', Validators.required],
      State: ['', Validators.required],
      City: ['', Validators.required],
      Booking: ['', Validators.required],
      Hotel: ['', Validators.required],
      Expedia: ['', [Validators.required]],
      items: this.formBuilder.array([this.createItem()])
    });

    this.addItem();
    this.addItem();

    if (this.id != "") {
      var link = 'UserSettings/EditUserSetting?id=' + this.id;

      this.appService.get(link, null).subscribe(
        data => {
          if (data != null) {
            data.Booking = data.BokingUrlId;
            data.Hotel = data.HotelUrlId;
            data.Expedia = data.ExpediaUrlId;
            this.userRegisterForm.patchValue(data);
            this.f.items.patchValue(data.roomTypeSetting);
            this.SpinnerService.hide();
            console.log(data);
            console.log(this.userRegisterForm);

            this.onStateChange(this.f.State)
            this.onCityChange(this.f.City)
            this.onBookingChange(this.f.Booking)
            this.onHotelChange(this.f.Hotel)
            this.onExpediaChange(this.f.Expedia)

          }
          else {
            this.SpinnerService.hide();
            this.toastService.show(data.error, {
              classname: 'bg-danger text-light',
            });
          }
        },
        err => {
          console.log(err);

          this.SpinnerService.hide();

        })
    }
  }

  get f() {
    return this.userRegisterForm.controls;
  }

  get formArr() {
    return this.userRegisterForm.get('items') as FormArray;
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      RoomType: ['', Validators.required],
      Booking: ['', Validators.required],
      Hotel: ['', Validators.required],
      Expedia: ['', [Validators.required]],

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
      { 'page': 'User Management', 'path': '/userSetting' },
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


  formData = {
    user_id: this.localStorageService.getValue().userId,
    user_type: this.localStorageService.getValue().userType,
    customer_id: this.localStorageService.getValue().customerId,
    property_ids: this.localStorageService.getValue().propertyIds
  };

  getStateList() {
    // var formData = {};
    var link = `${'UserSettings/GetStateList'}`;

    var formData = {};
    // var link = 'Roles/GetAllRoles';
    this.appService.get(link, formData).subscribe(
      data => {
        this.StateList = data;

      },
      err => {
      })
  }
  onStateChange(e) {
    this.SpinnerService.show();

    let val = e.value;
    var link = `${'UserSettings/GetCityList'}`;
    this.appService.get(link, { 'state': val.toString() })
      .subscribe(
        data => {
          this.SpinnerService.hide();
          this.CityList = data;
        },
        err => {
          this.SpinnerService.hide();
        })
  }

  onCityChange(e) {
    this.SpinnerService.show();

    let val = e.value;
    var link = `${'UserSettings/GetHotelList'}`;
    this.appService.get(link, { id: val })
      .subscribe(
        data => {
          this.SpinnerService.hide();
          this.BookingList = data[0];
          this.HotelList = data[1];
          this.ExpediaList = data[2];
        },
        err => {
          this.SpinnerService.hide();
        })
  }

  onBookingChange(e) {
    this.SpinnerService.show();

    let val = e.value;
    var link = `${'UserSettings/GetBookingTypeList'}`;
    this.appService.get(link, { id: val })
      .subscribe(
        data => {
          this.SpinnerService.hide();
          this.BookingTypeList = data;
        },
        err => {
          this.SpinnerService.hide();
        })
  }
  onHotelChange(e) {
    this.SpinnerService.show();

    let val = e.value;
    var link = `${'UserSettings/GetHotelTypeList'}`;
    this.appService.get(link, { id: val })
      .subscribe(
        data => {
          this.SpinnerService.hide();
          this.HotelTypeList = data;
        },
        err => {
          this.SpinnerService.hide();
        })
  }
  onExpediaChange(e) {
    this.SpinnerService.show();

    let val = e.value;
    var link = `${'UserSettings/GetExpediaTypeList'}`;
    this.appService.get(link, { id: val })
      .subscribe(
        data => {
          this.SpinnerService.hide();
          this.ExpediaTypeList = data;
        },
        err => {
          this.SpinnerService.hide();
        })
  }


  // onPropertyChange(ev,i){
  //   let propertyId = ev.value;
  //   // this.userRegisterForm.patchValue({
  //   //   roles:[],
  //   //   users:[]
  //   // });
  // this.roleList[i] = [];
  // let selectedIds = [];
  // let selectedValues = {};

  //   this.roleListAll.map(x => {
  //     if (x.property_ids.split(',').includes(propertyId.toString())) {
  //       if (!selectedIds.includes(x.id)) {
  //         selectedIds.push(x.id)
  //         selectedValues[x.id] = Object.assign({}, x);
  //         //this.roleList.push(x);
  //       }

  //     }
  //   })

  //   this.roleList[i] =  Object.values(selectedValues).map((itm, i) => {
  //     return itm;
  //   });
  //   // this.items = this.userRegisterForm.get('items') as FormArray;
  //   // this.items.get(i.toString()).patchValue({roles:undefined})
  //  // this.selectedClasses = this.items.value.map(itm=>itm.class);
  // }

  // Save new record 
  saveRecord() {
    //this.userRegisterForm.value.created_by = localStorage.getItem('userId');
    this.userRegisterForm.value.Uid = this.localStorageService.getValue().userId,
      this.userRegisterForm.value.user_type = this.localStorageService.getValue().userType,
      this.userRegisterForm.value.customer_id = this.localStorageService.getValue().customerId;


    let colneObj = Object.assign({}, this.userRegisterForm.value);
    delete colneObj.items;
    // var roomTypeSetting = JSON.stringify(this.userRegisterForm.value.items);
    //var jsonGeneral = JSON.stringify(colneObj);
    // var formData = {
    //   "roomTypeSetting ": roomTypeSetting, "general_details": colneObj
    // }

    // console.log(this.userRegisterForm.controls);
    // console.log(formData);

    if (this.userRegisterForm.valid) {

      colneObj.CityId = colneObj.City;
      colneObj.BokingUrlId = colneObj.Booking;
      colneObj.HotelUrlId = colneObj.Hotel;
      colneObj.ExpediaUrlId = colneObj.Expedia;
      colneObj.roomTypeSetting = this.userRegisterForm.value.items;
      console.log(colneObj);

      this.SpinnerService.show();
      var link = 'UserSettings/AddUserSetting';
      this.appService.post(link, colneObj).subscribe(
        data => {
          if (data.success) {
            this.SpinnerService.hide();
            this.toastService.show('Your data has been updated', {
              classname: 'bg-success text-light',
            });
            this.router.navigate(['/userSetting']);
          }
          else {
            this.SpinnerService.hide();
            this.toastService.show(data.error, {
              classname: 'bg-danger text-light',
            });
          }
        },
        err => {
          console.log(err);

          this.SpinnerService.hide();

        })
    }
  }
  // Update record 
  updateRecord() {

    // this.userRegisterForm.value.id = this.id;
    // this.userRegisterForm.value.created_by = this.localStorageService.getValue().userId;
    // var jsonRoleProp = JSON.stringify(this.userRegisterForm.value.items);
    // let colneObj = Object.assign({}, this.userRegisterForm.value);
    // delete colneObj.items;
    // //var jsonGeneral = JSON.stringify(colneObj);
    // var formData = { "user_roles_properties": jsonRoleProp, "general_details": colneObj }
    // console.log(this.userRegisterForm.controls);


    // console.log(formData);
    this.userRegisterForm.value.Uid = this.localStorageService.getValue().userId,
      this.userRegisterForm.value.user_type = this.localStorageService.getValue().userType,
      this.userRegisterForm.value.customer_id = this.localStorageService.getValue().customerId;


    let colneObj = Object.assign({}, this.userRegisterForm.value);
    delete colneObj.items;
    colneObj.CityId = colneObj.City;
    colneObj.BokingUrlId = colneObj.Booking;
    colneObj.HotelUrlId = colneObj.Hotel;
    colneObj.ExpediaUrlId = colneObj.Expedia;
    colneObj.roomTypeSetting = this.userRegisterForm.value.items;
    console.log(colneObj);

    if (this.userRegisterForm.valid) {


      // var link = `${'Users/' + this.id}`;
      var link = 'UserSettings/AddUserSetting?id=' + this.id;
      // this.appService.put("http://localhost:58602/api/Roles", formData, { params: this.id })
      this.appService.post(link, colneObj)
        .subscribe(
          data => {
            if (data != null) {
              this.SpinnerService.hide();
              this.toastService.show('Your data has been updated', {
                classname: 'bg-success text-light',
              });
              this.router.navigate(['/userSetting']);
            } else {
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
        if (data.length > 0) {
          let reqData = data[0];
          this.userRegisterForm.patchValue({
            user_name: reqData.user_name,
            first_name: reqData.first_name,
            last_name: reqData.last_name,
            user_email: reqData.user_email,
            user_password: reqData.user_password,
            roles: reqData.roles,
            properties: reqData.properties,
          });

          let arr = JSON.parse(reqData.roles_properties);
          console.log(arr);
          let control = this.userRegisterForm.get('items') as FormArray;
          while (control.length) {
            control.removeAt(0);
          }
          _this.items = arr;
          let propertyValue = [];
          arr.forEach((x, i) => {
            control.push(this.formBuilder.group({
              roles: x.role,
              properties: x.property
            }));
            propertyValue['value'] = x.property;
            // this.onPropertyChange(propertyValue, i)
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

    var formData = {
      user_id: this.localStorageService.getValue().userId,
      user_type: this.localStorageService.getValue().userType,
      customer_id: this.localStorageService.getValue().customerId
    };
    var link = 'Properties/GetAllProperties';
    this.appService.get(link, formData).subscribe(
      data => {
        // this.propertyList = data;
      },
      err => {
      })
  }
  onReset() {
    this.submitted = false;
    this.userRegisterForm.reset();
  }



}

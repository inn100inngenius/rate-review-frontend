import {
  Component,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';
import Swal from 'sweetalert2';
import {
  extend,
  addClass
} from '@syncfusion/ej2-base';
import {
  CardRenderedEventArgs,
  CardSettingsModel,
  ColumnsModel,
  DialogSettingsModel,
  KanbanComponent,
  SwimlaneSettingsModel
} from '@syncfusion/ej2-angular-kanban';
import {
  BreadcrumbService, LocalStorageService
} from '@app/_services';
import {
  ScriptService
} from '../../_services/script.service';
import {
  of
} from 'rxjs';
import {
  NgWizardConfig,
  NgWizardService,
  StepChangedArgs,
  StepValidationArgs,
  STEP_STATE,
  THEME
} from 'ng-wizard';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  AppService
} from '@app/app.service';
import {
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import {
  ToastService
} from '../../_services/toast.service';
import {
  NgxSpinnerService
} from "ngx-spinner";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./property-management.component.css'],
  providers: [ScriptService]

})

export class AddEditComponent implements OnInit {
  propertyForm: FormGroup;
  submitted = false;
  id: string;
  data: any;
  contacts: any = [1, 2, 3, 4, 5];
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
      }, ],
    }
  };
  isAddMode: boolean = false;
  user_id;
  model: NgbDateStruct;
  customersList =[];
  constructor(private route: ActivatedRoute, private router: Router, private breadcrumbService: BreadcrumbService,
    private script: ScriptService,
    private ngWizardService: NgWizardService, private appService: AppService, private formBuilder: FormBuilder,
    public toastService: ToastService,
    private SpinnerService: NgxSpinnerService,
    private localStorageService:LocalStorageService) {

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {

            this.getFormData();
            this.isAddMode = false;
          } else {
            this.isAddMode = true;
          }
          this.setBreadcrumb();
        }
      );
  }
  setBreadcrumb() {
    let page = this.id === undefined ? "Add Property" : "Update Property";
    let breadcrumbData = [{
        'page': 'home',
        'path': '/home'
      },
      {
        'page': 'Customer Management',
        'path': '/customer/dashboard'
      },
      {
        'page': 'Property Management',
        'path': '/property-management'
      },
      {
        'page': page,
        'path': ''
      },
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
    // this.script.load('jquerySteps','parsleyjs',
    // 'propertySteps').then(data => {
    // console.log('script loaded ', data);
    // }).catch(error => console.log(error));
  }
  userType;
  userId;
  ngOnInit(): void {
   
    this.userType = localStorage.getItem('userType');
    this.userId = localStorage.getItem('userId');
    this.propertyForm = this.formBuilder.group({
      customer_id:['', Validators.required],
      property_code: ['', Validators.required],
      property_name: ['', Validators.required],
      total_rooms: ['', Validators.required],
      branch_name: ['', Validators.required],
      organisation_name: ['', Validators.required],
      opened_date: ['', Validators.required],
      address: ['', Validators.required],
      city_town: ['', Validators.required],
      state: ['', Validators.required],
      zip_code: ['', Validators.required],
      bus_phone_1: ['', Validators.required],
      bus_phone_2: ['', Validators.required],
      bus_fax: ['', Validators.required],
      general_manager: ['', Validators.required],
      manager_email: ['', [Validators.required, Validators.email]],
      alternative_email: ['', [Validators.required, Validators.email]],
      management_company: ['', Validators.required],
      cell_phone: ['', Validators.required],
      password: [''],
      contact_details: this.formBuilder.array(this.contacts.map(contact => this.createItem())),

    });
    if (this.id === undefined) {
      this.propertyForm.get('password').setValidators(Validators.required);
    }
    if (this.userType == '2') {
      this.propertyForm.patchValue({
        customer_id:this.userId
      })
    }
    else{
      this.getAllCustomers();
    }
  }
  ngAfterContentInit() {

  }
  getAllCustomers(){
    var link = `${'Customers/GetAllCustomers'}`;
      var formData = {};
      this.appService.get(link,formData).subscribe(
        data => {
       this.customersList = data;
            console.log(data);
          }
         
        )
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      contact_name: '',
      email: '',
      number: '',
      support: '',
      emergency: ''
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.id === undefined) {
      this.saveRecord();
    } else {
      this.updateRecord();
    }
  }
  get f() {
    return this.propertyForm.controls;
  }
  // Save new record 
  saveRecord() {
    this.propertyForm.value.created_by = localStorage.getItem('userId');
    var jsonContact = JSON.stringify(this.propertyForm.value.contact_details);
    let colneObj = Object.assign({}, this.propertyForm.value);
    delete colneObj.contact_details;
    var jsonGeneral = JSON.stringify(colneObj);
    var formData = {
      "user_id" : this.localStorageService.getValue().userId,
      "contact_details": jsonContact,
      "general_details": jsonGeneral
    }

    if (this.propertyForm.valid) {
      this.SpinnerService.show();
      var link = 'Properties';
      this.appService.post(link, formData).subscribe(
        data => {
          if(data.success)
          {
          this.SpinnerService.hide();
          this.toastService.show('Your data has been saved', {
            classname: 'bg-success text-light',
          });
          this.router.navigate(['/property-management']);
        }
        else{
          this.SpinnerService.hide();
            this.toastService.show(data.error, {
              classname: 'bg-danger text-light',
            });
        }
         
        },
        err => {})
        
    }
  }
  getFormData() {
    var formData = {
      id: this.id
    };
    var link = 'Properties';
    var _this = this;
    this.appService.get(link, formData).subscribe(
      data => {
        if (data.length > 0) {

          let reqData = data[0];
          this.user_id = reqData.user_id;
          this.propertyForm.patchValue({
            customer_id:reqData.customer_id,
            property_code: reqData.property_code,
            property_name: reqData.property_name,
            total_rooms: reqData.total_rooms,
            branch_name: reqData.branch_name,
            organisation_name: reqData.organisation_name,
            opened_date: reqData.opened_date,
            address: reqData.address,
            city_town: reqData.city_town,
            state: reqData.state,
            zip_code: reqData.zip_code,
            bus_phone_1: reqData.bus_phone_1,
            bus_phone_2: reqData.bus_phone_2,
            bus_fax: reqData.bus_fax,
            general_manager: reqData.user_name,
            manager_email: reqData.user_email,
            alternative_email: reqData.alternative_email,
            management_company: reqData.management_company,
            cell_phone: reqData.telefone,
            password: reqData.user_password
          });

          let arr = JSON.parse(reqData.contact_details);
          this.contacts = arr;

          let control = this.propertyForm.get('contact_details') as FormArray;
          while (control.length) {
            control.removeAt(0);
          }
          // this.items =arr;
          arr.forEach(x => {
            control.push(this.formBuilder.group({
              contact_name: x.contact_name,
              email: x.contact_email,
              number: x.contact_number,
              support: x.support,
              emergency: x.emergency
            }));

          });
        }
      },
      err => {})
  }
  // Update record 
  updateRecord() {
    this.propertyForm.value.user_id = this.user_id;
    var jsonContact = JSON.stringify(this.propertyForm.value.contact_details);
    let colneObj = Object.assign({}, this.propertyForm.value);
    delete colneObj.contact_details;
    var jsonGeneral = JSON.stringify(colneObj);
    var formData = {
     "user_id" : this.localStorageService.getValue().userId,
     "contact_details": jsonContact,
     "general_details": jsonGeneral
    }
    if (this.propertyForm.valid) {
      this.SpinnerService.show();
      var link = `${'Properties/' + this.id}`;
      this.appService.put(link, formData)
        .subscribe(
          data => {
            if(data.success)
            {
            this.SpinnerService.hide();
            this.toastService.show('Your data has been updated', {
              classname: 'bg-success text-light',
            });
            this.router.navigate(['/property-management']);
          }else{
            this.SpinnerService.hide();
                this.toastService.show(data.error, {
                  classname: 'bg-danger text-light',
                });
          }
            // Swal.fire({
            //   icon: 'success',
            //   title: 'Your record has been updated',
            //   showConfirmButton: false,
            //   timer: 1500
            // }).then(() => {
            //   this.router.navigate(['/property-management']);
            // })

          },
          
          err => {})
    }
  }

  showPreviousStep(event ? : Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event ? : Event) {
    this.ngWizardService.next();
  }

  resetWizard(event ? : Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    if (args.step.index == 3) {
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

}
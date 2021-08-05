import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl  } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService, LocalStorageService } from '@app/_services';
import { ScriptService } from '../../_services/script.service';
import { AppService} from '@app/app.service';
import { ToastService } from '../../_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./customer-management.component.css'],
  providers: [ ScriptService ]
})
export class AddEditComponent implements OnInit {

  id: string
  data: any
  customerRegisterForm: FormGroup;
  submitted = false;
  imageSrc: string;
  isAddMode:boolean = false;
  public loading = false;

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private script:ScriptService,
    private appService:AppService,
    private formBuilder: FormBuilder,
    public toastService: ToastService, 
    private SpinnerService: NgxSpinnerService,
    private localStorageService:LocalStorageService) {

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];   
          if(this.id ){
            this.getFormData();
          }  
          else{
            this.isAddMode = true;
          }    
          this.setBreadcrumb();
        }
      );
      
  }

  ngOnInit(): void {
      this.customerRegisterForm = this.formBuilder.group({
      customer_name: ['', Validators.required],
      customer_email: ['', [Validators.required,Validators.email]],
      customer_password: [''],
      no_of_properties: ['', Validators.required],
      trial_period: [''],
      profile_image: [''],
      extra_days: [''],
    });
    if(this.id === undefined) {
      this.customerRegisterForm.get('customer_password').setValidators(Validators.required);
  } 
  }

  setBreadcrumb(){
    let page = this.id === undefined ? "Add Customer":"Update Customer";
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer'},
      {'page':page,'path':''}
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
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
    return this.customerRegisterForm.controls; 
  }

// Save new record 
    saveRecord() {
      console.log(this.customerRegisterForm.value);
      
    if (this.customerRegisterForm.valid) {
      this.SpinnerService.show();
      this.customerRegisterForm.value.created_by = this.localStorageService.getValue().userId;
      this.customerRegisterForm.value.ip = this.localStorageService.getValue().ip;
      this.customerRegisterForm.value.country_name = this.localStorageService.getValue().countryName;
      var formData = this.customerRegisterForm.value;
        var link = 'Customers';
        this.appService.post(link,formData).subscribe(
          data => {
            if(data.success)
            {
              this.SpinnerService.hide();
              this.toastService.show('Your data has been updated', {
                classname: 'bg-success text-light',
              });
              this.router.navigate(['/customer']);
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

// Update record 
  updateRecord() {
    console.log(this.customerRegisterForm.value,this.customerRegisterForm.valid);
    if (this.customerRegisterForm.valid) {
      this.SpinnerService.show();
      this.customerRegisterForm.value.id = this.id;
      this.customerRegisterForm.value.user_id = this.localStorageService.getValue().userId;
      this.customerRegisterForm.value.ip = this.localStorageService.getValue().ip;
      this.customerRegisterForm.value.country_name = this.localStorageService.getValue().countryName;
      var formData =this.customerRegisterForm.value;
      var link = `${'Customers/' + this.id}`;
      // this.appService.put("http://localhost:58602/api/Roles", formData, { params: this.id })
       this.appService.put(link,formData)
      .subscribe(
        data => {
          if(data.success)
          {
            this.SpinnerService.hide();
              this.toastService.show('Your data has been updated', {
                classname: 'bg-success text-light',
              });
              this.router.navigate(['/customer']);
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
   getFormData(){
    var formData = {id: this.id};
    var link = 'Customers';
    this.appService.get(link,formData).subscribe(
      data => {
        if(data.length > 0){
        let resData = data[0];
        this.customerRegisterForm.patchValue({
          customer_name: resData.user_name,
          customer_email: resData.user_email,
          trial_period: resData.trial_period,
          extra_days: resData.extra_days,
          no_of_properties: resData.no_of_properties,
          profile_image: resData.profile_image,
        });
      }
    },
  err => {
  })
  }
// Image preview
   onFileChange(event) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.customerRegisterForm.patchValue({
          fileSource: reader.result
        });
      };
    }
  }
}

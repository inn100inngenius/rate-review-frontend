import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthApiService} from './auth-api.service';
import {IpGeolocationService} from '@app/_services/ipGeolocation.service'
import { LocalStorageService ,AccountService} from '@app/_services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private authApiService:AuthApiService,
    private router: Router,private ipGeolocationService:IpGeolocationService,
    private localStorageService:LocalStorageService,private accountService:AccountService) { }
loginForm:FormGroup;
submitted = false;
  ngOnInit(): void {
   console.log();
this.ipGeolocationService.getGeoIp();
  
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required]]
    })
  }
  get f() { 
    return this.loginForm.controls; 
  }
  onSubmit(){
    this.submitted= true;
    if (this.loginForm.valid) {
      //formData = this.taskForm.value;
      this.loginForm.value.ip = this.localStorageService.getValue().ip;
      this.loginForm.value.country_name = this.localStorageService.getValue().countryName;
      this.loginForm.value.country_code = this.localStorageService.getValue().countryCode;
      this.authApiService.userLogin(this.loginForm.value).subscribe(
      async  data => {
          if(data.length > 0){
            
            await this.setLocalStorage(data[0]);
            this.router.navigate(['/home']);
            this.accountService.login(JSON.stringify(data[0].id));
          }
          else{
            Swal.fire({
                icon: 'error',
                title: 'Invalid Login',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                // this.router.navigate(['/task-management']);
              })
          }
          console.log(data);
         
          // Swal.fire({
          //   icon: 'success',
          //   title: 'Your task has been saved',
          //   showConfirmButton: false,
          //   timer: 1500
          // }).then(() => {
          //    this.router.navigate(['/task-management']);
          // })
        },
        err => {
        })
    } 
  }
  setLocalStorage(data){
    localStorage.setItem("userId",data.id);
    localStorage.setItem("userType",data.user_type);
    localStorage.setItem("userEmail",data.user_email);
    localStorage.setItem("userName",data.user_name);
    localStorage.setItem("customerId",data.customer_id);
    localStorage.setItem("propertyIds",data.properties);
  }
}

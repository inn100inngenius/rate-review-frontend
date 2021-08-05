import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BreadcrumbService } from '@app/_services';
import { ToastService } from '@app/_services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleApiService} from '../role-api.service';
@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {
  model:any ={};
modules = [{"id":1,
"module_name":"Task",
"rights":[
  {"name":"Add","default":false},
  {"name":"View","default":false},
  {"name":"Update","default":false},
  {"name":"Delete","default":false},
  {"name":"Approve","default":false},
  {"name":"Review","default":false},
  {"name":"nnn","default":false}
  ]},
{"id":2,
"module_name":"Document",
"rights":[
  {"name":"Add","default":false},
  {"name":"View","default":false},
  {"name":"Update","default":false},
  {"name":"Delete","default":false},
  {"name":"Approve","default":false},
  {"name":"Review","default":false}
  ]},
{"id":3,
"module_name":"Folder",
"rights":[
  {"name":"Add","default":false},
  {"name":"View","default":false},
  {"name":"Update","default":false},
  {"name":"Delete","default":false},
 
  ]}
];
id;
isAdd = true;
  constructor( private breadcrumbService: BreadcrumbService,
    public roleApiService: RoleApiService,
    private SpinnerService: NgxSpinnerService,
    public toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute) { 
      
      this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {
           
          }
          // this.setBreadcrumb();
        }
      );
  }

  ngOnInit(): void {
    this.getPermissionsByRoleId();
  }
  setBreadcrumb(){
    let breadcrumbData = [ 
      {'page':'home','path':'/home'},
      {'page':'Customer Management','path':'/customer'},
      {'page':'User Management','path':'/user-management'},
      {'page':'Permission','path':''}
    ];
    this.breadcrumbService.changeMessage(breadcrumbData);
  }
  saveRecord(){
    this.SpinnerService.show();
    var fdata = {role_id:this.id,rights:JSON.stringify(this.modules),
                created_by:localStorage.getItem("userId")};
    this.roleApiService.addPermissions(fdata).subscribe(
      data => {
          this.SpinnerService.hide();
          this.toastService.show('Your Permission details has been saved', {
            classname: 'bg-success text-light',
          });
          this.router.navigate(['/role-management']);
      },
      err => {
      })
  }
  getPermissionsByRoleId(){
    this.SpinnerService.show();
    var fData = {role_id:this.id};
    this.roleApiService.GetPermissionsByRoleId(fData).subscribe(
      (data: any)  => {
          this.SpinnerService.hide();
         
          if(data.length > 0){
            this.isAdd = false;
            let jsonValue= JSON.parse(data[0].rights);
            
           
            this.modules.map((mValue,mKey)=>
              {
                jsonValue.map((jValue ,jKey)=>
                  {
                   
                    if(mValue.id == jValue.id){
                      let mRights = mValue.rights;
                      let jRights = jValue.rights;
                      
                      mRights.find((mName,mNameKey)=>{

                        jRights.filter((jName,jNameKey)=>{
                         if( mName.name == jName.name ){
                         
                          mName.default = jName.default
                         }
                        
                      })

                    })
                  }
                   
                  })
               } )
          }
          else{
           
          }
      },
      err => {
      })
  }
  submitted;
  onSubmit() {
   
    this.submitted = true;
    this.saveRecord();
  }

  updateRecord(){
    
      this.SpinnerService.show();
      var fdata = {role_id:this.id,rights:JSON.stringify(this.modules),
                  created_by:localStorage.getItem("userId")};
      this.roleApiService.addPermissions(fdata).subscribe(
        data => {
            this.SpinnerService.hide();
            this.toastService.show('Your Permission details has been saved', {
              classname: 'bg-success text-light',
            });
            this.router.navigate(['/role-management']);
        },
        err => {
        })
    
  }
}

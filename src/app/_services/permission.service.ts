import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import{ LocalStorageService} from './localStorage.service'
@Injectable({
  providedIn: 'root'
})
export class permissionService {
 

  constructor(private localStorageService:LocalStorageService) { }
 //observeable for location details
 
  getValue(){
if(this.localStorageService.getValue().userType == 1){
  

   let modules = [{"id":1,
   "module_name":"Customers",
   "rights":[
     {"name":"Add","default":true},
     {"name":"View","default":true},
     {"name":"Update","default":true},
     {"name":"Delete","default":true},
    
     ]},{"id":2,
   "module_name":"Properties",
   "rights":[
     {"name":"Add","default":true},
     {"name":"View","default":true},
     {"name":"Update","default":true},
     {"name":"Delete","default":true},
   
     ]},{"id":3,
   "module_name":"Roles",
   "rights":[
     {"name":"Add","default":false},
     {"name":"View","default":true},
     {"name":"Update","default":true},
     {"name":"Delete","default":true},
    
     ]},{"id":4,
     "module_name":"Users",
     "rights":[
       {"name":"Add","default":false},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":true},
      
       ]},{"id":5,
    "module_name":"Task",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":true},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
      {"name":"Approve","default":false},
      {"name":"Review","default":false},
     
      ]},
    {"id":6,
    "module_name":"Document",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":true},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
      {"name":"Approve","default":false},
      {"name":"Review","default":false}
      ]},
    {"id":7,
    "module_name":"Folder",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":true},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
     
      ]},{"id":8,
      "module_name":"Audit Trials",
      "rights":[
       
        {"name":"View","default":true},
      
        ]},
        {"id":9,
    "module_name":"Notifications",
    "rights":[
      {"name":"Add","default":true},
      {"name":"View","default":true},
      {"name":"Update","default":true},
      {"name":"Delete","default":true},
      
      ]},
    ];
  }
  if(this.localStorageService.getValue().userType == 2){
    let modules = [{"id":1,
    "module_name":"Customers",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":false},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
     
      ]},{"id":2,
    "module_name":"Properties",
    "rights":[
      {"name":"Add","default":true},
      {"name":"View","default":true},
      {"name":"Update","default":true},
      {"name":"Delete","default":true},
    
      ]},{"id":3,
    "module_name":"Roles",
    "rights":[
      {"name":"Add","default":true},
      {"name":"View","default":true},
      {"name":"Update","default":true},
      {"name":"Delete","default":true},
     
      ]},{"id":4,
      "module_name":"Users",
      "rights":[
        {"name":"Add","default":true},
        {"name":"View","default":true},
        {"name":"Update","default":true},
        {"name":"Delete","default":true},
       
        ]},{"id":5,
     "module_name":"Task",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":false},
       {"name":"Approve","default":false},
       {"name":"Review","default":false},
      
       ]},
     {"id":6,
     "module_name":"Document",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":false},
       {"name":"Approve","default":false},
       {"name":"Review","default":false}
       ]},
     {"id":7,
     "module_name":"Folder",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":false},
       {"name":"Delete","default":false},
      
       ]},{"id":8,
       "module_name":"Audit Trials",
       "rights":[
        
         {"name":"View","default":true},
       
         ]},
         {"id":9,
     "module_name":"Notifications",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":true},
       
       ]},
     ];
  }
  if(this.localStorageService.getValue().userType == 3){
    let modules = [{"id":1,
    "module_name":"Customers",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":false},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
     
      ]},{"id":2,
    "module_name":"Properties",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":false},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
    
      ]},{"id":3,
    "module_name":"Roles",
    "rights":[
      {"name":"Add","default":true},
      {"name":"View","default":true},
      {"name":"Update","default":true},
      {"name":"Delete","default":true},
     
      ]},{"id":4,
      "module_name":"Users",
      "rights":[
        {"name":"Add","default":true},
        {"name":"View","default":true},
        {"name":"Update","default":true},
        {"name":"Delete","default":true},
       
        ]},{"id":5,
     "module_name":"Task",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":false},
       {"name":"Approve","default":false},
       {"name":"Review","default":false},
      
       ]},
     {"id":6,
     "module_name":"Document",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":false},
       {"name":"Approve","default":false},
       {"name":"Review","default":false}
       ]},
     {"id":7,
     "module_name":"Folder",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":false},
       {"name":"Delete","default":false},
      
       ]},{"id":8,
       "module_name":"Audit Trials",
       "rights":[
        
         {"name":"View","default":true},
       
         ]},
         {"id":9,
     "module_name":"Notifications",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":true},
       
       ]},
     ];
  }
  if(this.localStorageService.getValue().userType == 4){
    let modules = [{"id":1,
    "module_name":"Customers",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":false},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
     
      ]},{"id":2,
    "module_name":"Properties",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":false},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
    
      ]},{"id":3,
    "module_name":"Roles",
    "rights":[
      {"name":"Add","default":false},
      {"name":"View","default":false},
      {"name":"Update","default":false},
      {"name":"Delete","default":false},
     
      ]},{"id":4,
      "module_name":"Users",
      "rights":[
        {"name":"Add","default":true},
        {"name":"View","default":true},
        {"name":"Update","default":true},
        {"name":"Delete","default":true},
       
        ]},{"id":5,
     "module_name":"Task",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":false},
       {"name":"Approve","default":false},
       {"name":"Review","default":false},
      
       ]},
     {"id":6,
     "module_name":"Document",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":false},
       {"name":"Approve","default":false},
       {"name":"Review","default":false}
       ]},
     {"id":7,
     "module_name":"Folder",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":false},
       {"name":"Delete","default":false},
      
       ]},{"id":8,
       "module_name":"Audit Trials",
       "rights":[
        
         {"name":"View","default":true},
       
         ]},
         {"id":9,
     "module_name":"Notifications",
     "rights":[
       {"name":"Add","default":true},
       {"name":"View","default":true},
       {"name":"Update","default":true},
       {"name":"Delete","default":true},
       
       ]},
     ];
  }
  }
}

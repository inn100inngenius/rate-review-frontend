import { Injectable } from '@angular/core';
import { environment  } from '@environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleApiService {
  backendUrl: any;
  constructor(public http:HttpClient) {
    this.backendUrl = environment.backendURL;
   }
  listRole(): Observable<any> {
    return  this.http.get(`${this.backendUrl}/Roles/`);
  }
  
  
  addRole(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}/Roles`,data);
  }
  editRole(data): Observable<any> {
    return  this.http.get(`${this.backendUrl}/Roles/edit`,{params:data});
  }
  updateRole(data): Observable<any> {
    return  this.http.put(`${this.backendUrl}/Roles`,data);
  }
  deleteRole(data): Observable<any> {
    return  this.http.delete(`${this.backendUrl}/Roles`,{params:data});
  }
 
  addPermissions(data){
    return  this.http.post(`${this.backendUrl}Permissions/AddPermissions`,data);
  }
  GetPermissionsByRoleId(data){
    return  this.http.post(`${this.backendUrl}Permissions/GetPermissionsByRoleId`,data);
  }
}

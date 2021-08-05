import { Injectable } from '@angular/core';
import { environment  } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SystemTaskApiService {
  backendUrl: any;
  constructor(public http:HttpClient) {
    this.backendUrl = environment.backendURL;
   }
   getSystemTaskById(data): Observable<any> {
    return  this.http.get(`${this.backendUrl}SystemTasks/GetSystemTaskById`,{params:data});
  }
  
  getTableData(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks/GetTableData`,data);
  }
  addSystemTask(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks`,data);
  }
  getApproversByPropertyIds(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks/GetApproversByPropertyIds`,data);
  }
  getReviewersByPropertyIds(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks/GetReviewersByPropertyIds`,data);
  }
  
  getMySystemTasks(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks/GetMySystemTasks`,data);
  }
  updateFormValues(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks/UpdateFormValues`,data);
  }
  
}

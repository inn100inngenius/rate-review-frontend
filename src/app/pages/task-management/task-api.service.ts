import { Injectable } from '@angular/core';
import { environment  } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  backendUrl: any;
  constructor(public http:HttpClient) {
    this.backendUrl = environment.backendURL;
   }
  getAllTasks(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/getAllTasks`,data);
  }
  getTaskById(data): Observable<any> {
    return  this.http.get(`${this.backendUrl}Tasks/GetTaskById`,{params:data});
  }
  getSystemTaskById(data): Observable<any> {
    return  this.http.get(`${this.backendUrl}SystemTasks/GetSystemTaskById`,{params:data});
  }
 

 

  getAllProperties(data): Observable<any> {
    return  this.http.get(`${this.backendUrl}Properties/GetAllProperties`,{params:data});
  }
  getAllRolesByUser(data): Observable<any> {
    return  this.http.get(`${this.backendUrl}Roles/GetAllRolesByUser`,{params:data});
  }
  getAllUsersByUser(data): Observable<any> {
    return  this.http.get(`${this.backendUrl}Users/getAllUsersByProperties`,{params:data});
  }

  
  
  getAllRoles(): Observable<any> {
    return  this.http.get(`${this.backendUrl}Roles/GetAllRoles`);
  }
  getAllUsers(): Observable<any> {
    return  this.http.get(`${this.backendUrl}Users/GetAllUsers`);
  }
  
  getTaskStatusCount(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/getTaskStatusCount`,data);
  }
  getTaskChartData(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/GetTaskChartData`,data);
  }
  
  addTask(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks`,data);
  }
  addTaskComment(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/AddTaskComment`,data);
  }
  changeTaskStatus(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/ChangeTaskStatus`,data);
  }
  uploadFiles(data){
    return  this.http.post(`${this.backendUrl}Tasks/UploadFiles`,data);
  }
  getMyTasks(data): Observable<any>{
    return  this.http.post(`${this.backendUrl}Tasks/GetMyTasks`,data);
  }
  getMyApprovals(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/GetMyApprovals`,data);
  }
  getMyReviews(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/GetMyReviews`,data);
  }
  getMyRejectedTasks(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/getMyRejectedTasks`,data);
  }
  getApproversByPropertyIds(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks/GetApproversByPropertyIds`,data);
  }
  getReviewersByPropertyIds(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}SystemTasks/GetReviewersByPropertyIds`,data);
  }
  getTaskTimeline(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/GetTaskTimeline`,data);
  }
  addTaskAction(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/AddTaskAction`,data);
  }

  getUserStatusByTasks(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Tasks/GetUserStatusByTasks`,data);
  }
  
  // editTask(data): Observable<any> {
  //   return  this.http.get(`${this.backendUrl}Tasks/edit`,{params:data});
  // }
  // updateTask(data): Observable<any> {
  //   return  this.http.put(`${this.backendUrl}Tasks`,data);
  // }
  // deleteTask(data): Observable<any> {
  //   return  this.http.delete(`${this.backendUrl}Tasks`,{params:data});
  // }
}

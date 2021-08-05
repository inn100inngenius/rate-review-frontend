import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {

 
  backendUrl: any;
  constructor(public http:HttpClient) {
    this.backendUrl = environment.backendURL;
   }
   getNotificationsByUserId(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Notifications/GetNotificationsByUserId`,data);
  }
  
  readNotification(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Notifications/ReadNotification`,data);
  }
  // getTaskById(data): Observable<any> {
  //   return  this.http.get(`${this.backendUrl}Tasks/GetTaskById`,{params:data});
  // }
  
 
}

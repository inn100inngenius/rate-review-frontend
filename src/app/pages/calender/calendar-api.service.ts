import { Injectable } from '@angular/core';
import { environment  } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CalendarApiService {
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
  
  
}

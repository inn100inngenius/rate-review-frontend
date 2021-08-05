import { Injectable } from '@angular/core';
import { environment  } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  backendUrl: any;
  constructor(public http:HttpClient) {
    this.backendUrl = environment.backendURL;
   }
 
  
  userLogin(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Auth/UserLogin`,data);
  }
  
}

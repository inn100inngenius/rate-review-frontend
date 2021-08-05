import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  backendUrl: any;
  header ;
  constructor(private http: HttpClient) { 
    this.backendUrl = environment.backendURL;
    this.header = environment.headers;
  }

  //  Create data through post()
  post(link,data): Observable<any>{
    return this.http.post(`${this.backendUrl + link}`,data,{headers:this.header});
  }

  //  View data through get()
  get(link,data): Observable<any>{
    const httpOptions = {
      headers: this.header,
      params: data
    };
    return this.http.get(`${this.backendUrl + link}`,httpOptions);
  }

  //  Update data through put()
  put(link,data): Observable<any>{
    return this.http.put(`${this.backendUrl + link}`,data,{headers:this.header});
  }

  //  DELETE data 
  delete(link,data): Observable<any>{
    return this.http.delete(`${this.backendUrl + link}`, data)
  }

  // File Upload
  fileUpload(link,data): Observable<any>{
    return this.http.post(`${this.backendUrl + link}`,data);
  }
   
}

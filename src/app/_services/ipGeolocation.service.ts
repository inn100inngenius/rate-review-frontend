import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class IpGeolocationService {
 

  constructor(private http:HttpClient) { 
   
      
   
  }
 //observeable for location details
 //https://api.ipify.org?format=json https://api.ipdata.co/?api-key=test https://jsonip.com
  getGeoIp(){
    if(localStorage.getItem('ip') == null || localStorage.getItem('countryName') == null){
  this.http.get<any>('https://jsonip.com')
  .subscribe(data=>{
    
    this.geoIp(data.ip);
    
  });
  }
  }
  geoIp(ip){
    this.http.get<any>('https://ipapi.co/'+ip+'/json/')
  .subscribe(data=>{
    let ip =data.ip;
    localStorage.setItem('ip',data.ip);
    localStorage.setItem('countryName',data.country_name);
    localStorage.setItem('countryCode',data.country_code);
  })
  }
  // getCountry(): Observable<any>{
  //  return this.http.get('https://api.ipgeolocationapi.com/geolocate');
  // }
}

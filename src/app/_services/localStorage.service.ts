import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
 

  constructor() { }
 //observeable for location details
 
  getValue(){
    let storage = { ...localStorage};
    return storage;
  }
  
  clear(){
    localStorage.clear();
  }
}

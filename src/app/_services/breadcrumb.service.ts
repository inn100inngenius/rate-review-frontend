import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private messageSource = new BehaviorSubject<any>([]);
  currentMessage = this.messageSource.asObservable();

  constructor() { }
 //observeable for location details
 changeMessage(message: any) {
  this.messageSource.next(message);
}
  
}

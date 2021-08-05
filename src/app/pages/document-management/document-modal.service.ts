import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentModalService {
  private messageSource = new BehaviorSubject<any>({});
  currentMessage = this.messageSource.asObservable();

  
  constructor() { }
 //observeable for  details
 changeMessage(message: any) {
  this.messageSource.next(message);
}

  
}


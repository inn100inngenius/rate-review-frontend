import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentSidemenuService {
  private messageSource = new BehaviorSubject<any>([]);
  currentMessage = this.messageSource.asObservable();

  private nodeId = new BehaviorSubject<any>(null);
  currentNodeId = this.nodeId.asObservable();

  private folderPath = new BehaviorSubject<any>([{
    id: 0,
    node_name: 'Public',
    isExpanded: true,
    count: 10,
    parent_id : null,
    children: [
      
    ]
  }]);
  currentFolderPath = this.folderPath.asObservable();
  constructor() { }
 //observeable for  details
 changeMessage(message: any) {
  this.messageSource.next(message);
}
changeNodeId(message: any){
  this.nodeId.next(message);
}
changeFolderPath(message: any){
  this.folderPath.next(message);
}
  
}


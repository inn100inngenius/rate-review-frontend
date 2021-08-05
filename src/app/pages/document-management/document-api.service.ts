
import { Injectable } from '@angular/core';
import { environment  } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DocumentApiService {
  backendUrl: any;
  constructor(public http:HttpClient) {
    this.backendUrl = environment.backendURL;
   }
  
  // getAllProperties(): Observable<any> {
  //   return  this.http.get(`${this.backendUrl}Properties/GetAllProperties`);
  // }
  
  getMostDownloadedDocuments(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetMostDownloadedDocuments`,data);
  }
  getDocumentDownloadcount(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentDownloadcount`,data);
  }
  getDocumentUploadcount(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentUploadcount`,data);
  }
  getDocumentStatusChartData(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentStatusChartData`,data);
  }
  getDocumentStatusCount(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentStatusCount`,data);
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
  
  createFolder(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/CreateFolder`,data);
  }
  getDocumentTree(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentTree`,data);
  }
  addNewDocuments(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/AddNewDocuments`,data);
  }
  getAllDocumentsByParentId(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetAllDocumentsByParentId`,data);
  }
  getRecentFileUploadsByUserId(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetRecentFileUploadsByUserId`,data);
  }
  getDocumentDetailsById(data){
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentDetailsById`,data);

  }
  addDocumentRevision(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/DocumentCheckIn`,data);
  }
  
  getDocumentPath(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentPath`,data);
  }
  downloadCount(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/DownloadCount`,data);
  }
  approveDocument(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/ApproveDocument`,data);
  }
  
  reviewDocument(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/ReviewDocument`,data);
  }
  rejectDocument(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/RejectDocument`,data);
  }
  getAllDocuments(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetAllDocuments`,data);
  }
  getDocumentAuditTrails(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetDocumentAudit`,data);
  }
  getMyDocuments(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetMyDocuments`,data);
  }
  getMyDocumentApprovals(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetMyDocumentApprovals`,data);
  }
  getMyDocumentReviewals(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetMyDocumentReviewals`,data);
  }
  getMyRejectedDocuments(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetMyRejectedDocuments`,data);
  }
  getAllDocumentRevisions(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetAllDocumentRevisions`,data);
  }
  getAllTaskDocuments(data): Observable<any> {
    return  this.http.post(`${this.backendUrl}Documents/GetAllTaskDocuments`,data);
  }

  
}


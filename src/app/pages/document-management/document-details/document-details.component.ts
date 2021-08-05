import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { DocumentApiService } from '../document-api.service';
import { environment } from '@environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
interface Approver {
  name: string;
  status: number;
  date: string;
  role: string;
}
interface Reviewer {
  name: string;
  status: number;
  date: string;
  role: string;
}
interface Revision {
  name: string;
  version: string;
  status: number;
  date: string;
}
interface Activities {
  name: string;
  time: string;
  comment: number;
  date: string;
}
interface Properties {
  code: number;
  name: string;
  email: string;
  number: number;
  address: string;
  state: string;
}
interface Downloads {
  date: string;
  name: string;
  role: string;
  location: string;
  ip: string;
}

const APPROVERS: Approver[] = [
  {
    name: 'Aarya',
    status: 1,
    date: '2020-06-04',
    role : 'Manager'
  },
  {
    name: 'Bellamy Blake',
    status: 0,
    date: '',
    role : 'general Manager'
  },
  {
    name: 'Johnas',
    status: 1,
    date: '2020-05-16',
    role : 'Sales Manager'
  },
  {
    name: 'Lexa',
    status: 0,
    date: '',
    role : 'Front Office Manager'
  },
  {
    name: 'Octavia Blake',
    status: 0,
    date: '',
    role : 'Banquet Manager'
  },
  {
    name: 'Nathen',
    status: 1,
    date: '2020-05-17',
    role : 'Kitchen Staff'
  },
  {
    name: 'Morocco',
    status: 0,
    date: '',
    role : 'Head Chef'
  },
  {
    name: 'Ann Marie',
    status: 1,
    date: '',
    role : 'Room Service'
  }
];

const REVIEWERS: Reviewer[] = [
  {
    name: 'Johnas',
    status: 1,
    date: '2020-05-16',
    role : 'Manager'
  },
  {
    name: 'Lexa',
    status: 0,
    date: '',
    role : 'Room Service'
  },
  {
    name: 'Octavia Blake',
    status: 1,
    date: '2020-06-23',
    role : 'Head Chef'
  },
  {
    name: 'Bellamy Blake',
    status: 0,
    date: '',
    role : 'Banquet Manager'
  },
  {
    name: 'Aarya',
    status: 1,
    date: '2020-06-04',
    role : 'Front Office Manager'
  }
];

const REVISION: Revision[] = [
  {
    name: 'Account return 2020-1.pdf',
    version: '1.0',
    status: 1,
    date: '2020-05-16'
  },
  {
    name: 'Account return 2020-2.pdf',
    version: '1.5',
    status: 2,
    date: '2020-06-19'
  },
  {
    name: 'Account return 2020-3.pdf',
    version: '2.0',
    status: 3,
    date: '2020-06-23'
  },
  {
    name: 'Account return 2020-4.pdf',
    version: '3.0',
    status: 1,
    date: '2020-07-11'
  },
  {
    name: 'Account return 2020-5.pdf',
    version: '3.5',
    status: 2,
    date: '2020-08-04'
  },
  {
    name: 'Account return 2020-6.pdf',
    version: '4.0',
    status: 1,
    date: '2020-09-22'
  }
];

const ACTIVITIES: Activities[] = [
  {
    name: 'Test user',
    time: '17:25',
    comment: 1,
    date: '2020-05-16',
  },
  {
    name: 'Test user 2',
    time: '05:36',
    comment: 2,
    date: '2020-07-19',
  },
  {
    name: 'Test user 3',
    time: '13:24',
    comment: 3,
    date: '2020-07-24',
  },
  {
    name: 'Test user 4',
    time: '18:30',
    comment: 4,
    date: '2020-07-25',
  },
  {
    name: 'Test user',
    time: '01:10',
    comment: 5,
    date: '2020-07-27',
  },
  {
    name: 'Test user',
    time: '07:45',
    comment: 6,
    date: '2020-07-29',
  },
  {
    name: 'Test user 2',
    time: '03:40',
    comment: 7,
    date: '2020-07-30',
  },
  {
    name: 'Test user',
    time: '09:41',
    comment: 8,
    date: '2020-07-30',
  }
];

const PROPERTIES: Properties[] = [
  {
    code: 1147,
    name: "Property 1",
    email: "gm@xyz.com",
    number: 2245762,
    address: "Baker street, House 22",
    state: "California"
  },
  {
    code: 1185,
    name: "Property 2",
    email: "gm1@xyz.com",
    number: 7586324,
    address: "Wall street",
    state: "Texas"
  },
  {
    code: 1245,
    name: "Property 3",
    email: "gm@xyz.com",
    number: 854624,
    address: "Xyz ameny",
    state: "Florida"
  },
  {
    code: 1347,
    name: "Property 4",
    email: "gm2@xyz.com",
    number: 2245762,
    address: "Capitol Building",
    state: "Georgia"
  },
  {
    code: 1399,
    name: "Property 5",
    email: "gm3@xyz.com",
    number: 365482,
    address: "Baker street, House 22",
    state: "Alaska"
  },
  {
    code: 1475,
    name: "Property 6",
    email: "gm8@xyz.com",
    number: 365475,
    address: "Wall street",
    state: "Arizona"
  },
  {
    code: 1512,
    name: "Property 7",
    email: "gm9@xyz.com",
    number: 745698,
    address: "asdf qwerty",
    state: "Michigan"
  },
  {
    code: 1965,
    name: "Property 8",
    email: "gm5@xyz.com",
    number: 325462,
    address: "Winder fall",
    state: "Washington"
  }
];

const DOWNLOADS: Downloads[] = [
  {
    date: '2020-05-16',
    name: 'Johnas',
    role : 'Manager',
    location: 'Texas',
    ip: '192.168.100.23',
  },
  {
    date: '2020-05-13',
    name: 'Lexa',
    role : 'Room Service',
    location: 'Michigan',
    ip: '192.168.0.101',
  },
  {
    date: '2020-04-23',
    name: 'Octavia Blake',
    role : 'Head Chef',
    location: 'Washington',
    ip: '192.168.24.101',
  },
  {
    date: '2020-04-23',
    name: 'Bellamy Blake',
    role : 'Banquet Manager',
    location: 'Arizona',
    ip: '194.173.84.112',
  },
  {
    date: '2020-03-04',
    name: 'Aarya',
    role : 'Front Office Manager',
    location: 'Georgia',
    ip: '197.124.118.100',
  }
];

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.less'],
  providers:[ScriptService]

})
export class DocumentDetailsComponent implements OnInit {
  paramStatus: number = 0;
  approvers = APPROVERS;
  reviewers = REVIEWERS;  
  revisions = REVISION;  
  activities = ACTIVITIES;  
  properties = PROPERTIES;  
  downloads = DOWNLOADS;  
  active = 1;
  id;
  docDetails = undefined;
  submitted:boolean;
  constructor(private script:ScriptService, private route: ActivatedRoute,
    private documentApiService:DocumentApiService,private SpinnerService: NgxSpinnerService,
    private localStorageService:LocalStorageService) { 
      this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];   
         
        }
      );
    }

  ngOnInit(): void {
this.getDocumentDetailsById();
    this.script.load('chartBundle').then(data => {
      console.log('script loaded ', data);
      }).catch(error => console.log(error));

      console.log(this.route.snapshot.queryParams);
     if(this.route.snapshot.queryParams['status']){
      this.paramStatus = this.route.snapshot.queryParams['status'];
     }

    console.log(this.paramStatus); 
    // this.animateValue("value", 0, 50, 5000);
  }

  // Download Counter
  animateValue(id, start, end, duration) {
    if (start === end) return;
    var range = end - start;
    var current = start;
    var increment = end > start? 1 : -1;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);    
  }


getDocumentDetailsById(){
  var _this = this;
  var formdata = {
    id:this.id,
    user_id:this.localStorageService.getValue().userId,
    property_ids:this.localStorageService.getValue().propertyIds,
    customer_id:this.localStorageService.getValue().customerId,
    user_type:this.localStorageService.getValue().userType
  }
  this.SpinnerService.show();
  this.documentApiService.getDocumentDetailsById(formdata).subscribe(
    data => {
      if((<any>data).length > 0){
        this.SpinnerService.hide();
        console.log(data);
        (<any>data).map(x=>{
          x.f_name = x.document_name;
          let resArray = x.document_name.split(".");
          x.f_type =  resArray[resArray.length - 1];
          resArray.splice(resArray.length - 2, 1);
          x.document_name  = resArray.join('.');
         
        })
        _this.docDetails = data[0];
        _this.docDetails.download_count =_this.docDetails.download_count == "0"? 0 : _this.docDetails.download_count;
        this.animateValue("value", 0, _this.docDetails.download_count, 3000);
        _this.docDetails.document_size =  this.humanFileSize(_this.docDetails.document_size);
        _this.docDetails.doc_approvers= JSON.parse(_this.docDetails.doc_approvers);
        _this.docDetails.doc_reviewers= JSON.parse(_this.docDetails.doc_reviewers);
        _this.docDetails.doc_properties= JSON.parse(_this.docDetails.doc_properties);
        _this.docDetails.doc_roles= JSON.parse(_this.docDetails.doc_roles);
        _this.docDetails.doc_users= JSON.parse(_this.docDetails.doc_users);
        _this.docDetails.doc_audits= _this.docDetails.doc_audits == null ?[] :JSON.parse(_this.docDetails.doc_audits);

        _this.docDetails.doc_revisions= _this.docDetails.doc_revisions == null ?[] :JSON.parse(_this.docDetails.doc_revisions);
        _this.docDetails.doc_timeline= _this.docDetails.doc_timeline == null ?[] :JSON.parse(_this.docDetails.doc_timeline);

        console.log(_this.docDetails);
        if(_this.docDetails.doc_revisions.length > 0){
          _this.docDetails.doc_revisions.map(x=>{
            x.f_name = x.document_name;
            let resArray = x.document_name.split(".");
            resArray.splice(resArray.length - 2, 1);
            x.document_name  = resArray.join('.');
          })
          
        }
       
        
          _this.docDetails.doc_approvers.map((x,i)=>{
            let  isApproveBtn = false;
            if(_this.docDetails.approve_status == 0 ){
            let previousApproveStatus
            if(i > 0){
              previousApproveStatus = _this.docDetails.doc_approvers[i - 1].approve_status;
            }
            if(x.user_id == this.localStorageService.getValue().userId ){
              if(x.approve_level == 1 && x.approve_status == 0){
                isApproveBtn = true;
              }
              else{
                if(x.approve_level == 1 && x.approve_status == 1){
                  isApproveBtn = false;
                }
                else
                {
                  if(x.approve_level > 1 && x.approve_status == 1){
                    isApproveBtn = false;
                  }
                  else if(x.approve_level > 1 && x.approve_status == 0 && previousApproveStatus == 1){
                    isApproveBtn = true;
                  }
                  
                }
              }
            
            
            }
            else{
              isApproveBtn = false;
            }
          }
            x.isApproveBtn = isApproveBtn;
          })
        


        _this.docDetails.doc_reviewers.map((x,i)=>{
          let  isReviewBtn = false;
          if(_this.docDetails.approve_status == 1 && _this.docDetails.review_status == 0 ){
          let previousReviewStatus
          if(i > 0){
            previousReviewStatus = _this.docDetails.doc_reviewers[i - 1].review_status;
          }
          if(x.user_id == this.localStorageService.getValue().userId ){
            if(x.review_level == 1 && x.review_status == 0){
              isReviewBtn = true;
            }
            else{
              if(x.review_level == 1 && x.review_status == 1){
                isReviewBtn = false;
              }
              else
              {
                if(x.review_level > 1 && x.review_status == 1){
                  isReviewBtn = false;
                }
                else if(x.review_level > 1 && x.review_status == 0 && previousReviewStatus == 1){
                  isReviewBtn = true;
                }
                
              }
            }
          
           
          }
          else{ 
            isReviewBtn = false;
          }
        }
          x.isReviewBtn = isReviewBtn;
        })

      }
      
    },
    err=>{})
}
approveDocument(){
  let data ={user_id : this.localStorageService.getValue().userId,
    doc_id:this.id,id:this.docAction.user_id ,d_id:this.docDetails.id,comment:this.docAction.comment};
 
  console.log(data);
  this.SpinnerService.show();
  this.documentApiService.approveDocument(data).subscribe(
    data => {
      this.SpinnerService.hide();
      console.log(data);
     this.getDocumentDetailsById();
    },
    err=>{})
  }
  reviewDocument(){
    let data ={user_id : this.localStorageService.getValue().userId,
      doc_id:this.id,id:this.docAction.user_id ,d_id:this.docDetails.id,comment:this.docAction.comment};
 
    console.log(data);
    this.SpinnerService.show();
    this.documentApiService.reviewDocument(data).subscribe(
      data => {
        this.SpinnerService.hide();
        console.log(data);
       this.getDocumentDetailsById();
      },
      err=>{})
  }
  rejectDocument(){
    let data ={user_id : this.localStorageService.getValue().userId,doc_id:this.id,
      id:this.docAction.user_id ,d_id:this.docDetails.id,comment:this.docAction.comment};
 
    console.log(data);
    this.SpinnerService.show();
    this.documentApiService.rejectDocument(data).subscribe(
      data => {
        console.log(data);
        this.SpinnerService.hide();
       this.getDocumentDetailsById();
      },
      err=>{})
  }
  docAction: any = {};
  docActionSubmitted = false;
  addDocAction(){
    this.docActionSubmitted = true;
    if(this.docAction.comment && this.docAction.comment.trim() != ""){
      this.docAction.doc_id = this.id;
      this.docAction.action_user_id = this.localStorageService.getValue().userId;
     // this.taskAction.action_status = 
    console.log(this.docAction);
    document.getElementById('docActionModal').click();
    if(this.docAction.action_type == 1){
      this.approveDocument();
    }
    if(this.docAction.action_type == 2){
      this.rejectDocument();
    }
    if(this.docAction.action_type == 3){
      this.reviewDocument();
    }
    }
    
  }
  docActionStatus(status,appid){
    this.docAction.action_type = status;
    this.docAction.user_id = appid;
    
  }
  viewDocument(){
    let data = {document_id:this.docDetails.id}
    var _this = this;
    this.SpinnerService.show();
    this.documentApiService.getDocumentPath(data).subscribe(
      data => {
        this.SpinnerService.hide();
      console.log(data)
      let path = environment.imageURL+data+this.docDetails.f_name;
      // environment.imageURL+data+name
      window.open(path, "_blank");
   
       })


   
}
 humanFileSize(size) {
  var i = Math.floor( Math.log(size) / Math.log(1024) );
  return Number(( size / Math.pow(1024, i) ).toFixed(2)) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}
downloadFile(d_fid,d_id,d_name){
  let fid = d_fid;
  let id = d_id;
  let name = d_name;
  let data = {document_id:id}
  var _this = this;
  this.documentApiService.getDocumentPath(data).subscribe(
    data => {
    console.log(data)
    fetch(environment.imageURL+data+name)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
      let dCountData = {document_id:fid,user_id:_this.localStorageService.getValue().userId}
     _this.downloadCount(dCountData);
      // Here's where you get access to the blob
      var url = window.URL.createObjectURL(new Blob([blob], {type: 'data:attachment/'}));
      const link = document.createElement('a');
      link.setAttribute('href',url);
      link.setAttribute('download', name);
      link.click();
      link.remove();
  });
     })

}
downloadMyFile(){

  let fid = this.docDetails.id;
  let id = this.docDetails.document_id;
  let name = this.docDetails.f_name;
  //let data = {document_id:id}
  this.downloadFile(fid,id,name);
}
downloadMyRevision(d_id,d_fid,d_fname){
  let fid = d_id;
  let id = d_fid;
  let name = d_fname;
  //let data = {document_id:id}
  this.downloadFile(fid,id,name);
}
downloadCount(dCountData){
  this.documentApiService.downloadCount(dCountData).subscribe(
    data=>{

    }
  )
}
}

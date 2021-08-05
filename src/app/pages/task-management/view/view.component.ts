import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskApiService } from '../task-api.service';
import {formatDate} from '@angular/common';
import { environment} from '@environments/environment';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { LocalStorageService } from '@app/_services';
import { ToastService } from '@app/_services/toast.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewComponent implements OnInit {

  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'myTableElementId'   
    // --Types--
    // Image - .png
    // PDF - .pdf
    // CSV - .csv
    // Text - .txt
    // Microsoft Excel sheets - .xls, .xlsx
    // Microsoft Word documents - .doc, .docx
    // JSON - .json
    // XML - .xml
  }


  paramStatus: number = 0;
  selectedValue  = "all";
  userstate: boolean;
  urlFragment: string;
  id;
  taskDetails;
  taskDocumentPath = environment.taskDocumentPath;
  imageFormats = [".png",".svg",".jpg",".jpeg"];
  model: any = {};
  submitted:boolean;
  userTaskPercentage = 0;
  // public files: NgxFileDropEntry[] = [];
  // isFileUpload:boolean= true;
  documents = [];
  active =1;
  isTxtboxShown = true;
  constructor(private router: Router, private route: ActivatedRoute,
  private taskApiService: TaskApiService, private exportAsService: ExportAsService,
  private localStorageService:LocalStorageService,public toastService: ToastService, 
  private SpinnerService: NgxSpinnerService,) { }

  // Export page
  export() {
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'My File Name').subscribe(() => {
    // save started
    });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    this.exportAsService.get(this.exportAsConfig).subscribe(content => {
      console.log(content);
    });
  }


  ngOnInit(): void {
    // this.route.queryParams
    //   .filter(params => params.status)
    //   .subscribe(params => {
    //     this.paramStatus = params.status;
    //   }
    // );
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          if (this.id) {
            this.getTaskById();
          }
          // this.setBreadcrumb();
        }
      );

    //console.log(this.paramStatus); 
  }

  // Drop file
  files: File[] = [];

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  //! Drop file

  // Navigate timeline
  gotoTimeline(val){
    this.userstate = val == 0 ? false : true;
    this.urlFragment = val == 0 ? "timeline" : "multitimelines";
    this.router.navigate(['/task-management/timeline'], { queryParams: { multi: this.userstate } ,  fragment: this.urlFragment });
  }
  taskActionsByUsersArray;
  
  getTaskById() {
    var params = {id:this.id};
    this.SpinnerService.show();
    var _this = this;
    this.taskApiService.getTaskById(params).subscribe(
      async data => {
        _this.SpinnerService.hide();
        //alert();
        console.log(data);
        let taskDetails = data[0];
        taskDetails.task_approvers = JSON.parse(taskDetails.task_approvers);
        taskDetails.task_reviewers = JSON.parse(taskDetails.task_reviewers);
        taskDetails.task_users = JSON.parse(taskDetails.task_users);
        taskDetails.task_properties = JSON.parse(taskDetails.task_properties);
        taskDetails.task_roles = JSON.parse(taskDetails.task_roles);
        taskDetails.start_date = formatDate(taskDetails.start_date, 'd MMMM y', 'en-US');
        taskDetails.due_date = formatDate(taskDetails.due_date, 'd MMMM y', 'en-US');
        taskDetails['task_documents'] = taskDetails.task_documents == null ? [] :JSON.parse(taskDetails.task_documents);
        taskDetails['task_comments'] = taskDetails.task_comments == null ? [] :JSON.parse(taskDetails.task_comments);
        taskDetails['task_comment_users'] = taskDetails.task_comment_users == null?[] :JSON.parse(taskDetails.task_comment_users);
        taskDetails['task_actions'] = taskDetails.task_actions == null?[] :JSON.parse(taskDetails.task_actions);

        taskDetails["isApprover"] = false;
        taskDetails.task_approvers.map(u=>{
          if(u.user_id == this.localStorageService.getValue().userId && u.approve_status == 0){
            taskDetails["isApprover"] = true;
            taskDetails["approveLevel"] = u.level;
          }
        }) 
        taskDetails["isReviewer"] = false;
        taskDetails.task_reviewers.map(u=>{
          if(u.user_id == this.localStorageService.getValue().userId && u.review_status == 0){
            taskDetails["isReviewer"] = true;
            taskDetails["reviewLevel"] = u.level;
          }
        }) 
        taskDetails["approveBtn"] = false;
        if(taskDetails["isApprover"] == true && taskDetails["approveLevel"] == 1){
          taskDetails["approveBtn"] = true;
          
        }
        else{
          taskDetails.task_approvers.map(u=>{
            if((u.level == (parseInt(u.level) - 1)) && u.approve_status != 0 ){
              taskDetails["approveBtn"] = true;
            }
          }) 
        }
        taskDetails["reviewBtn"] = false;
        if(taskDetails["isReviewer"] == true && taskDetails["reviewLevel"] == 1){
          taskDetails["reviewBtn"] = true;
          
        }
        else{
          taskDetails.task_approvers.map(u=>{
            if((u.level == (parseInt(u.level) - 1)) && u.review_status != 0 ){
              taskDetails["reviewBtn"] = true;
            }
            
          }) 
        }
       
      let totalPercentage =0;
        let total =0;
        let totalUsers  = taskDetails.task_users.length;
       
        // if(taskDetails.task_users.length > 0)
        // { this.activeUser = taskDetails.task_users[0].user_id;}
        taskDetails.task_users.map(u=>{
         
        //  if(taskDetails.isApprover && u.task_status == 2){
        //    u[""]
        //  }
          // let fvalue = u.form_values.trim() == ""?[]:JSON.parse(u.form_values);
          // u.form_values = {"data":fvalue};
          // if(u.task_status == 0){ totalPercentage = totalPercentage + 33.3  }
          // if(u.task_status == 1){ totalPercentage = totalPercentage + 66.6  }
          // if(u.task_status == 2){ totalPercentage = totalPercentage + 99.9  }
          if(u.task_status == 0){ totalPercentage = totalPercentage + 20  }
            if(u.task_status == 1){ totalPercentage = totalPercentage + 40  }
            if(u.task_status == 2){ totalPercentage = totalPercentage + 60  }
            if(u.approve_status == 1){ totalPercentage = totalPercentage + 20  }
            if(u.review_status == 1){ totalPercentage = totalPercentage + 20  }
        })
        total = totalPercentage / totalUsers;
        taskDetails['task_percentage'] = total;
        
        //this.taskDetails = taskDetails;
        this.taskDetails =  await this.taskActionsByUsers(taskDetails);
        console.log(this.taskDetails);
       // this.taskDetails = taskDetails;
       // setTimeout(function(){ alert("Hello"); }, 3000);
        //this.paramStatus = 1;
        
      },
      err=>{})
    }
    async taskActionsByUsers(taskDetails){
      taskDetails.task_users.map(async x=>{
        x["task_actions"]= [];
        x["task_review_actions"]= [];
        x["user_task_approvers"]=[];
        x["user_task_reviewers"]=[];



//////////////////////////////////////////////////////////////////////////////////////////////////


        await taskDetails.task_approvers.map((approvers,i)=>{
            let  isApproveBtn = false;
           
            let obj1:any = Object.assign({}, approvers);
            obj1.isPendingBtn = false;
            let merged:any ={};
            let f = 0;
            taskDetails.task_actions.map(a=>{
              if( x.user_id == a.user_id && approvers.approver_id == a.action_user_id ){
                //x["task_actions"].push(a);
                //console.log(x.user_id ,a.user_id +" | "+ approvers.approver_id , a.action_user_id )
                let obj2:any = Object.assign({}, a);
                merged = {...obj1, ...obj2};
                if( a.action_type == 1 || a.action_type == 3 ){
                  f = 1;
                  merged.isApproveBtn = false;
                  x["user_task_approvers"].push(merged);
                }
              }
            })
            if(f == 0){
              approvers.approve_status = 0;
             let previousApproveStatus;
            if(i > 0){
              previousApproveStatus = x["user_task_approvers"][i - 1].action_type ;
            }
            if(approvers.user_id == this.localStorageService.getValue().userId ){
              if(approvers.level == 1 && x.task_status == 2 ){
                isApproveBtn = true;
              }
              
                else
                {
                  if(approvers.level > 1  && x.task_status != 2 ){
                    isApproveBtn = false;
                  }
                  else if(approvers.level > 1 &&   x.task_status == 2  && previousApproveStatus == 1){
                    isApproveBtn = true;
                  }
                  
                }
              
            }
            else{
              isApproveBtn = false;
              
            }
            obj1.previousApproveStatus = previousApproveStatus;
            obj1.isApproveBtn  = isApproveBtn;
            obj1.isPendingBtn = !isApproveBtn ;
           // console.log(obj1.isApproveBtn,obj1.isPendingBtn)
            //obj1.isPendingBtn = true;
              // else{
              //   obj1.isApproveBtn = false;
              //   obj1.isPendingBtn = true;
              // }
              x["user_task_approvers"].push(obj1);
            }
        })


        ///////////////////////////////////////////////////////////////

        await taskDetails.task_reviewers.map(async (reviewers,i)=>{
          let  isReviewBtn = false;
         
          let isAllApproved = x["user_task_approvers"].find(app=>app.action_type != 1);
          //console.log("isAllApproved -" ,isAllApproved);
          let obj1:any = Object.assign({}, reviewers);
          obj1.isPendingBtn = false;
          let merged:any ={};
          let f = 0;
          if(isAllApproved == undefined){
           taskDetails.task_actions.map( a=>{
            if(x.user_id == a.user_id && reviewers.reviewer_id == a.action_user_id ){
             // x["task_review_actions"].push(a);
              let obj2:any = Object.assign({}, a);
              merged = {...obj1, ...obj2};
              if( a.action_type == 2 ){
                f = 1;
                merged.isReviewBtn  = false;
                x["user_task_reviewers"].push(merged);
              }
            }
          })
          if(f == 0){
            reviewers.review_status = 0;
            let previousReviewStatus;
           
           if(i > 0){
            previousReviewStatus = x["user_task_reviewers"][i - 1].action_type ;
           }
          
           if(reviewers.user_id == this.localStorageService.getValue().userId ){
             if(reviewers.level == 1 && x.task_status == 2 ){
               isReviewBtn = true;
             }
             
               else
               {
                 if(reviewers.level > 1  && x.task_status != 2 ){
                  isReviewBtn = false;
                 }
                 else if(reviewers.level > 1 &&   x.task_status == 2  && previousReviewStatus == 2){
                  isReviewBtn = true;
                 }
                 
               }
             
           }
           else{
            isReviewBtn = false;
             
           }
          
           obj1.previousReviewStatus = previousReviewStatus;
           obj1.isReviewBtn  = isReviewBtn;
           obj1.isPendingBtn = !isReviewBtn ;
           //console.log(obj1.isReviewBtn,obj1.isPendingBtn)
             x["user_task_reviewers"].push(obj1);
          }
        }
        else{
          obj1.isReviewBtn  = false;
           obj1.isPendingBtn = true ;
           //console.log(obj1.isReviewBtn,obj1.isPendingBtn)
           x["user_task_reviewers"].push(obj1);
        }
        })
      })
      return taskDetails;
     
    }
    // async taskActionsByUsers(taskDetails){
    //   taskDetails.task_users.map(async x=>{
    //     x["task_actions"]= [];
    //     x["task_review_actions"]= [];
    //      await taskDetails.task_approvers.map(approvers=>{
          
    //       taskDetails.task_actions.map(a=>{
    //         if(x.user_id == a.user_id && approvers.approver_id == a.action_user_id &&( a.action_type == 1 || a.action_type == 3 )){
    //           x["task_actions"].push(a);
  
    //         }
    //       })
    //     })
    //     taskDetails.task_reviewers.map(async reviewers=>{
          
    //      await  taskDetails.task_actions.map( a=>{
    //         if(x.user_id == a.user_id && reviewers.reviewer_id == a.action_user_id && a.action_type == 2 ){
    //           x["task_review_actions"].push(a);
  
    //         }
    //       })
    //     })
    //   })
    //   return taskDetails;
     
    // }
    
    addComment(){
      this.submitted = true;
      if(this.model.comment && this.model.comment.trim() != ""){
      this.model.created_by = localStorage.getItem("userId");
      this.model.task_id =this.id;
      console.log(this.model);
      this.taskApiService.addTaskComment(this.model).subscribe(
        data => {
          console.log(data);
          this.model.comment="";
         this.getTaskById();
          //this.paramStatus = 1;
        },
        err=>{})
      }
    }
    getUserTaskPercentage(){
     console.log(this.selectedValue);
      this.taskDetails.task_users.map(x=>{
        if(x.user_id == this.selectedValue){
          this.userTaskPercentage = (x.task_status + 1) * 20;
          console.log(this.userTaskPercentage);
        }
      })
    }


  fileUpload(){
    if(this.files.length > 0){
    let input = new FormData();
    input.append('task_id', this.id);
    for(var i=0;i<this.files.length;i++){
      input.append('task_documents[]',this.files[i]);
    }
    this.taskApiService.uploadFiles(input).subscribe(
      data => {
        console.log(data);
        document.getElementById('close-modal').click();
        this.toastService.show('File Uploaded', {
          classname: 'bg-success text-light',
        });
        this.getTaskById();
      },
      err => {
      })
    }
  }
  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  taskAction: any = {};
  taskActionSubmitted = false;
  addTaskAction(){
    this.SpinnerService.show();
    this.taskActionSubmitted = true;
    if(this.taskAction.comment && this.taskAction.comment.trim() != ""){
      this.taskAction.task_id = this.id;
      this.taskAction.action_user_id = this.localStorageService.getValue().userId;
     // this.taskAction.action_status = 
    console.log(this.taskAction);
    document.getElementById('taskActionModal').click();
    this.taskApiService.addTaskAction(this.taskAction).subscribe(
      data => {
        console.log(data);
        this.SpinnerService.hide();
        this.getTaskById();
      },
      err => {
      })
    }
    
  }
  taskActionStatus(status,userid){
    this.taskAction.action_type = status;
    this.taskAction.user_id = userid;
  }
  showTxtbox(){
    console.log(212);
    this.isTxtboxShown = !this.isTxtboxShown;
  }
  // toggleFileUpload(){
  //   this.isFileUpload = !this.isFileUpload;
  // }
}

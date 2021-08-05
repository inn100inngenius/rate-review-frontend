import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit ,Renderer2, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@app/_services';
import { ScriptService } from '@app/_services/script.service';
import { DataTableDirective } from 'angular-datatables';
import { DocumentApiService } from '../document-api.service';
import { environment } from '@environments/environment';
import { DocumentModalService } from '../document-modal.service';

@Component({
  selector: 'app-revision-control',
  templateUrl: './revision-control.component.html',
  styleUrls: ['./revision-control.component.less'],
  providers: [ScriptService]
})
export class RevisionControlComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  @ViewChild('datatable') table: ElementRef;
  dataTable: any;
  dtOptions: any = {};
  datatable: any;
  siteModal: any=[];
  listenerFn: () => void;
  statusNotation: number;
  urlStatusFragment: string;


  constructor(private script: ScriptService, private router: Router,
    private documentApiService:DocumentApiService,
    private renderer: Renderer2,
    private localStorageService:LocalStorageService,
    private documentModalService:DocumentModalService) {
   
  }

  ngOnInit(): void {
    
    const that = this;
    this.listenerFn = this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("data-owner")) {
        this.documentModalData(event.target.getAttribute("data-owner"));
      }
      if (event.target.hasAttribute("data-approver")) {
        this.documentModalData(event.target.getAttribute("data-approver"));
      }
      if (event.target.hasAttribute("data-reviewer")) {
        this.documentModalData(event.target.getAttribute("data-reviewer"));
      }
      if (event.target.hasAttribute("data-checkin")) {
        this.router.navigate(["document-management/document-checkin/" + event.target.getAttribute("data-checkin")]);
      }
      if (event.target.hasAttribute("data-info")) {
        this.router.navigate(["document-management/document-details/" + event.target.getAttribute("data-info")]);
      }
      if (event.target.hasAttribute("data-download")) {
        this.downloadMyFile(event.target.getAttribute("data-download"));
      }
      if (event.target.hasAttribute("data-your-approval")) {
        this.router.navigate(["document-management/document-details/" + event.target.getAttribute("data-your-approval")]);
      }
      if (event.target.hasAttribute("data-your-reviewal")) {
        this.router.navigate(["document-management/document-details/" + event.target.getAttribute("data-your-reviewal")]);
      }
      
    });
    this.getTableData();
  }

  async documentModalData(id){
    let obj =  await  this.siteModal.find(x=>x.document_id == id)
    this.documentModalService.changeMessage(obj);
  }
  async getDocumentObj(id){
   let docObj = await  this.siteModal.find(x=>x.id == id)
    return docObj;
  }
  async downloadMyFile(_id){
    
     let obj = await this.getDocumentObj(_id);
     
    let fid = obj.id;
    let id = obj.document_id;
    let name = obj.f_name;
    let data = {document_id:id}
    var _this = this;
    this.documentApiService.getDocumentPath(data).subscribe(
      data => {
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
  downloadCount(dCountData){
    this.documentApiService.downloadCount(dCountData).subscribe(
      data=>{
  
      }
    )
  }
  ngOnDestroy() {
    if (this.listenerFn) {
      this.listenerFn();
    }
  }
  
  getTableData(){

  
  
    const that = this;
    let start;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      serverSide: true,
      processing: true,
      autoWidth:true,
      ajax: (dataTablesParameters: any, callback) => {
        start = dataTablesParameters.start;
        dataTablesParameters.user_id = that.localStorageService.getValue().userId;
        dataTablesParameters.user_type = that.localStorageService.getValue().userType;
        dataTablesParameters.customer_id = that.localStorageService.getValue().customerId;
        that.documentApiService.getAllDocumentRevisions
          (
            dataTablesParameters
          ).subscribe(resp => {
            that.siteModal = resp.data;
            
            console.log(resp.data);
            that.siteModal.map(x => {
              x.f_name = x.document_name;
              x.doc_approvers =JSON.parse(x.doc_approvers);
              x.doc_reviewers =JSON.parse(x.doc_reviewers);
              x.isMyApproval = x.doc_approvers.find(k=>k.approver_id == this.localStorageService.getValue().userId) == undefined  ?false:true;
              x.isMyReviewal = x.doc_reviewers.find(r=>r.reviewer_id == this.localStorageService.getValue().userId) == undefined ?false:true;
             
              x.docCurrentStatus = x.approval_status == 1?'approved':
                                    x.reviewal_status == 1?'reviewed':
                                    x.approval_status == 2?'rejected':
                                    x.isMyApproval == true?'your approval':
                                    x.isMyReviewal == true?'your reviewal':
                                    '';

              let resArray = x.document_name.split(".");
              resArray.splice(resArray.length - 2, 1);
              x.document_name  = resArray.join('.');
              x.created_at = formatDate(x.created_at, 'MM-dd-y', 'en-US');

            })
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: that.siteModal 
            });
          });
      },
      columns: [{ title:"no",data: null,
      render: function (data, type, row, meta) {
        return start + meta.row +1;
      } },
      {title:"document",data:'document_name'},
      {title:"Rev",data:'revision'},
      {title:"Author",data:'user_name'},
      {title:"date",data:'created_at'},
      {title:"status",
       data:null,
       render: function (data, type, row, meta) {
        let htm = '';
        if(row.isMyApproval && row.approve_status == 0){
          //yourapproval
         
          htm +='<button data-your-approval='+row.document_id+' class="custom-btn bg-warning rounded mg-r-3">Your approval</button>';
        }
        if(row.isMyApproval && row.approve_status == 2){
          //rejected
          htm +='<span class="tx-medium tx-danger ">Rejected</span>';
        }
        else if( row.approve_status == 1){
          //approved
          htm +='<span class="tx-medium tx-success "> Approved </span>';
        }
        else if( row.isMyReviewal  && row.review_status == 0){
          //youreviewal
          htm +='<button data-your-reviewal='+row.document_id+' class="custom-btn bg-warning rounded mg-r-3">Your Reviewal</button>';
        }
         if( row.review_status == 1){
          //reviewed
          htm +='<span class="tx-medium tx-warning "> Reviewed </span>';
        }
        else if(row.approve_status == 0 && row.review_status == 0 && !row.isMyReviewal && row.isMyApproval){
          //pending
          htm +='<span class="tx-medium tx-info ">Pending</span>';

        }
        return htm;
        }},
       {title:"Information",
       data:null,
       render: function (data, type, row, meta) {
        let htm = '';
        
        htm += '<a href="#owner"   class="modal-effect" data-toggle="modal" data-effect="effect-scale"><span data-owner='+row.document_id+' class="badge rounded-50 tx-12 mg-r-6 badge-warning">O</span></a>';
        htm += '<a href="#approver" class="modal-effect" data-toggle="modal" data-effect="effect-scale"><span  data-approver='+row.document_id+' class="badge rounded-50 tx-12 mg-r-6 badge-primary">A</span></a>';
        htm += '<a href="#reviewer"   class="modal-effect" data-toggle="modal" data-effect="effect-scale"><span data-reviewer='+row.document_id+' class="badge rounded-50 tx-12 mg-r-6 badge-success">R</span></a>';
        return htm;
        }},
       {title:"Action",
       data:null,
       render: function (data, type, row, meta) {
        let htm = '';
        
        htm += '<a  role="button"  data-toggle="tooltip" title="CheckIn" ><i data-checkin='+row.document_id+' class="fa fa-sign-in-alt tx-primary mg-r-6"></i></a>';
        htm += '<a  role="button"   data-toggle="tooltip" title="Download"><i data-download='+row.id+' class="fa fa-download tx-info mg-r-6"></i></a>';
        htm += '<a   role="button"  data-toggle="tooltip" title="Share"><i data-share='+row.document_id+' class="fa fa-share-alt tx-gray-700 mg-r-6"></i></a>';
        htm += '<a   role="button"  data-toggle="tooltip" title="Information" ><i data-info='+row.document_id+' class="fa fa-info-circle tx-danger mg-r-6"></i></a>';

        return htm;
        
       }},
      ]
    };
    
  }

}

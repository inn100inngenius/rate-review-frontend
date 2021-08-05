import { Component, OnInit, ViewChild } from '@angular/core';
import { ITreeOptions, TreeComponent, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { DocumentApiService } from '../document-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentSidemenuService} from './document-sidemenu.service';
import { ToastService } from '@app/_services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from '@app/_services';

@Component({
  selector: 'app-document-sidemenu',
  templateUrl: './document-sidemenu.component.html',
  styleUrls: ['./document-sidemenu.component.less']
})
export class DocumentSidemenuComponent implements OnInit {
  items:any = [];
  msgSubscription;
  nodeIdSubscription;
  currentNodeId;
  selectedProperties = [];
  propertyList = [];
  dropdownSettings: any = {};
  ShowFilter = true;
  @ViewChild('tree') treeComponent: TreeComponent;
  @ViewChild('tree1') treeComponent1: TreeComponent;
	nodes = [
    {
      id: 0,
      node_name: 'Public',  
      isExpanded: true,    
      count: 10,
      node_type: 1,
      children: [
        
      ]
    },
   
  ];
  nodes1 = [
    {
      id: 0,
      node_name: 'Public',  
      isExpanded: true,    
      count: 10,
      node_type: 1,
      children: [
        
      ]
    },
   
  ];
  pathIds = [];
  parentId;
  parentId1;
  options: ITreeOptions = {
    actionMapping: {
        mouse: {
            click: (tree, node, $event) => {
              TREE_ACTIONS.ACTIVATE(tree, node, $event);
                const lineage = [];
                lineage.push(node.data);
                console.log(node);
                if(node.data.node_type == 2){
                  this.router.navigate(['/document-management/document-details/'+node.data.id ]);
                }
                else{
                this.parentId=node.data;
                this.getAllDocumentsByParentId(node.data.id);
                this.getNodesByParentId(node.data.id);
                this.getFullPath(node.data.id);
                }
               
                
            }
        }
    }
}


//onPropertyChange() {
    // this.docForm.patchValue({
    //   roles: [],
    //   users: []
    // });
    // this.roleList = [];
    // let selectedIds = [];
    // let selectedValues = {};
    // this.docForm.value.properties.map(itm => {
    //   this.roleListAll.map(x => {
    //     if (x.property_ids.split(',').includes(itm.id.toString())) {
    //       if (!selectedIds.includes(x.id)) {
    //         selectedIds.push(x.id)
    //         selectedValues[x.id] = Object.assign({}, x);
    //         selectedValues[x.id]["selected_prop"] = itm.property_name;
    //         this.roleList.push(x);
    //       }
    //       else {
    //         selectedValues[x.id]["selected_prop"] = selectedValues[x.id]["selected_prop"] +
    //           " , " + itm.property_name;
    //       }
    //     }
    //   })

    // })


    // this.roleList = Object.values(selectedValues).map((itm, i) => {
    //   itm["role_name"] = itm["role_name"] + ' (' + itm["selected_prop"] + ')';
    //   return itm;
    // });
    // this.getApproversByPropertyIds(this.docForm.value.properties);
    // this.getReviewersByPropertyIds(this.docForm.value.properties);

 // }
// options1: ITreeOptions = {
//   actionMapping: {
//       mouse: {
//           click: (tree, node, $event) => {
//             TREE_ACTIONS.ACTIVATE(tree, node, $event);
//               const lineage = [];
//               lineage.push(node.data);
//               console.log(node);
//               if(node.data.node_type == 2){
//                 this.router.navigate(['/document-management/document-details/'+node.data.id ]);
//               }
//               else{
//               this.parentId=node.data;
//               this.getAllDocumentsByParentId(node.data.id);
//               this.getNodesByParentId(node.data.id);
//               this.getFullPath(node.data.id);
//               }
             
              
//           }
//       }
//   }
// }
options1: ITreeOptions = {
  actionMapping: {
      mouse: {
          click: (tree, node, $event) => {
            TREE_ACTIONS.ACTIVATE(tree, node, $event);
              const lineage = [];
              this.pathIds = [];
              // add clicked node as first item
              lineage.push(node.data);
              this.pathIds.push(node.data);
              this.parentId1=node.data;
              // grab parent of clicked node
              let parent = node.parent;

              // loop through parents until the root of the tree is reached
              while(parent !== null){
                  lineage.push(parent.data);
                  this.pathIds.push(parent.data);
                  parent = parent.parent;
                  
              }
              
          }
      }
  }
}
  documentsOnly=[];
  foldersOnly=[];

  model: any = {};
  submitted:boolean;
  constructor(private documentApiService:DocumentApiService,
    private documentSidemenuService:DocumentSidemenuService, private router: Router,
    private route:ActivatedRoute,public toastService: ToastService, 
    private SpinnerService: NgxSpinnerService,
    private localStorageService:LocalStorageService) { }

  ngOnInit(): void {
    this.getAllProperties();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'property_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter
    };
      this.nodeIdSubscription = this.documentSidemenuService.currentNodeId.subscribe(
      message => {
        
        this.currentNodeId = message;
        if(message != null){
          this.getAllDocumentsByParentId(message);
          this.getNodesByParentId(message);
          this.getFullPath(message);
        }
        
      });
    this.getDocumentTree();
  }
  ngOnDestroy() {
    this.documentSidemenuService.changeNodeId(null);
    this.documentSidemenuService.changeFolderPath([{
      id: 0,
      node_name: 'Public',
      isExpanded: true,
      count: 10,
      parent_id : null,
      children: [
        
      ]
    }]);
    // unsubscribe to avoid memory leaks
   // this.msgSubscription.unsubscribe();
    this.nodeIdSubscription.unsubscribe();
  }
  fullPath=[];
  getFullPath(id){
   
    if(this.router.url != '/document-management'){
      this.router.navigate(['/document-management']);
    }
               
    this.fullPath = [];
    let node = this.treeComponent.treeModel.getNodeById(id);
    this.fullPath.push(node.data);
    let parent = node.parent;
    while(parent !== null){
      this.fullPath.push(parent.data);
      parent = parent.parent;
    }
    this.fullPath.reverse().splice(0,1)
  this.documentSidemenuService.changeFolderPath(this.fullPath);
  }
  getAllDocumentsByParentId(id){
    var _this = this;
    var data = {parent_id : id,
      user_id : this.localStorageService.getValue().userId,
      user_type : this.localStorageService.getValue().userType,
      property_ids : this.localStorageService.getValue().propertyIds};
    _this.documentApiService.getAllDocumentsByParentId(data).subscribe(
      data => {
        _this.documentsOnly=[];
       data.map(x=>{
         if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
         {
          x["children"] = [{}];
         }
         if(x.node_type == 2 ){
          x.doc_approvers = JSON.parse(x.doc_approvers);
          x.doc_reviewers = JSON.parse(x.doc_reviewers);
          x.f_name = x.node_name;
          let resArray = x.node_name.split(".");
          resArray.splice(resArray.length - 2, 1);
          x.node_name  = resArray.join('.');
          _this.documentsOnly.push(x);
        }
       })
       let docsData = {'documents':_this.documentsOnly,'folders':_this.foldersOnly,'parent_id':0};
       this.documentSidemenuService.changeMessage(docsData);
      },
      err=>{})

  }
  
  getDocumentTree(){
    var _this = this;
    var data = {node_id : 0,
      user_id : this.localStorageService.getValue().userId,
      user_type : this.localStorageService.getValue().userType,
      property_ids : this.localStorageService.getValue().propertyIds};
    this.getAllDocumentsByParentId(0);
    this.documentApiService.getDocumentTree(data).subscribe(
      data => {
        _this.foldersOnly=[];
       data.map(x=>{
         if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
         {
          x["children"] = [{}];
         }
         if(x.node_type == 2){
          x.f_name = x.node_name;
          let resArray = x.node_name.split(".");
          resArray.splice(resArray.length - 2, 1);
          x.node_name  = resArray.join('.');
        }
        else{
          _this.foldersOnly.push(x);
          this.nodes1[0].children.push(x);
          this.nodes1[0].count =  data.length;
        }
         
        this.nodes[0].children.push(x);

       })
       this.nodes[0].count = data.length;
       
       let docsData = {'documents':_this.documentsOnly,'folders':_this.foldersOnly,'parent_id':0};
       this.documentSidemenuService.changeMessage(docsData);
       this.treeComponent.treeModel.update();
       this.treeComponent1.treeModel.update();
       console.log(this.nodes)
      },
      err=>{})
  }

  getNodesByParentId(id){
    var _this = this;
    var data = {node_id :id,
      user_id : this.localStorageService.getValue().userId,
        user_type : this.localStorageService.getValue().userType,
        property_ids : this.localStorageService.getValue().propertyIds};
    this.documentApiService.getDocumentTree(data).subscribe(
      data => {
        _this.foldersOnly=[];
       this.treeComponent.treeModel.getNodeById(id).data.children = [];
      // this.treeComponent1.treeModel.getNodeById(id).data.children = [];
       data.map(x=>{
         if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
         {
          x["children"] = [{}];
         }
         if(x.node_type == 2){
           x.f_name = x.node_name;
          let resArray = x.node_name.split(".");
          resArray.splice(resArray.length - 2, 1);
          x.node_name  = resArray.join('.');
        }
        else{
          _this.foldersOnly.push(x);
         
         // this.treeComponent1.treeModel.getNodeById(id).data.children.push(x);
          //this.nodes1[0].count = data.length;
        }
         x["isExpanded"] = false;
         this.treeComponent.treeModel.getNodeById(id).data.children.push(x);
       })
       this.nodes[0].count = data.length;
      
       let docsData = {'documents':_this.documentsOnly,'folders':_this.foldersOnly,'parent_id':0};
       this.documentSidemenuService.changeMessage(docsData);
       this.treeComponent.treeModel.update();
     //  this.treeComponent1.treeModel.update();
      },
      err=>{})
  }
  toggleExpanded(event:any){
    
  if(event.isExpanded){
    this.getFullPath(event.node.data.id);
    this.getAllDocumentsByParentId(event.node.data.id);
    this.getNodesByParentId(event.node.data.id);
  }
  }
  toggleExpanded1(event:any){

    if(event.isExpanded){
      var data = {node_id : event.node.data.id,
        user_id : this.localStorageService.getValue().userId,
        user_type : this.localStorageService.getValue().userType,
        property_ids : this.localStorageService.getValue().propertyIds};
      this.documentApiService.getDocumentTree(data).subscribe(
        data => {
         this.treeComponent1.treeModel.getNodeById(event.node.data.id).data.children = [];
         data.map(x=>{
           if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
           {
            x["children"] = [{}];
           }
           if(x.node_type == 2){
            let resArray = x.node_name.split(".");
            resArray.splice(resArray.length - 2, 1);
            x.node_name  = resArray.join('.');
          }
           x["isExpanded"] = false;
           this.treeComponent1.treeModel.getNodeById(event.node.data.id).data.children.push(x);
         })
         this.treeComponent1.treeModel.update();
        },
        err=>{})
    
    }
    }
myDocuments(){
    this.router.navigate(['/document-management/my-documents']);
  }
approval(){
    this.router.navigate(['/document-management/my-approvals']);
  }
myCheckouts(){
    this.router.navigate(['/document-management/my-checkouts']);
  }
myReviews(){
    this.router.navigate(['/document-management/my-reviews']);
  }
myRejectedDocs(){
    this.router.navigate(['/document-management/my-rejected-docs']);
  }
advanceTracking(){
    this.router.navigate(['/document-management/advance-tracking']);
  }
revisionControl(){
    this.router.navigate(['/document-management/revision-control']);
  }
// folder
  clickHandler(event: any) {
    // console.log(this.treeComponent.treeModel.focusedNode.data);
     
 }
 addFolder(){
  let pathStr = "";
  this.pathIds.slice(0).reverse().map(x=>{
    if(x.node_name)
    {pathStr = pathStr + x.node_name + '/';}
  })
  
  this.submitted = true;
      if(this.model.folder_name && this.model.folder_name.trim() != ""){
        if(this.parentId1 == undefined){
          this.toastService.show('Select a folder', {
            classname: 'bg-danger text-light',
          });
        }
        else{
      //let propertyIds =    this.model.properties.map(x=> x.id)
      let propertyIds = this.model.properties.map(x=> x.id)
      this.model.property_ids = propertyIds.toString();
      this.model.created_by = this.localStorageService.getValue().userId;// localStorage.getItem("userId");
      this.model.path_ids = pathStr ;
      this.model.parent_id = this.parentId1.id;
      this.SpinnerService.show();
      this.documentApiService.createFolder(this.model).subscribe(
        data => {
          this.SpinnerService.hide();
          this.model.comment="";
          
          if(data.success){
           // Swal.fire('Success', 'Folder Created', 'success');
            this.toastService.show('Folder Created', {
              classname: 'bg-success text-light',
            });
          }
          else{
            this.toastService.show('Folder Name Already Exists', {
              classname: 'bg-danger text-light',
            });
            //Swal.fire('Error', '', 'error');
          }
         // Swal.fire('Oops...', 'Something went wrong!', 'error')
        },
        err=>{})
      }
      }
}
getAllProperties() {
  var formData = {user_id:this.localStorageService.getValue().userId,
    user_type:this.localStorageService.getValue().userType,
  customer_id:this.localStorageService.getValue().customerId,
  property_ids:this.localStorageService.getValue().propertyIds
};
  this.documentApiService.getAllProperties(formData).subscribe(
    data => {
      console.log(data);
      this.propertyList = data
    },
    err => {
    })
}
onPropertyChange(evType){
  if(evType == 4){
    this.model.properties = [];
    //this.getAllTasks();
  }
  else if(evType == 3){
    this.model.properties =  this.propertyList;
    //this.getAllTasks();
  }
  else{
   // this.getAllTasks();
  }
  
}
}

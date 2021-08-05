import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptService } from '@app/_services/script.service';
import Swal from 'sweetalert2';
import{ DocumentApiService} from '../document-api.service';
import { DocumentSidemenuService} from '../document-sidemenu/document-sidemenu.service';
import { IActionMapping, TreeComponent,TREE_ACTIONS, TreeModel, TreeNode, ITreeOptions } from '@circlon/angular-tree-component';
import { environment } from '@environments/environment'
import { LocalStorageService } from '@app/_services';
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
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.css'],
  providers:[ScriptService]
})
export class DocumentManagementComponent implements OnInit {
  @ViewChild('tree') treeComponent: TreeComponent;
  statusNotation: number;
  urlStatusFragment: string;

  paramStatus: number = 0;
  approvers = APPROVERS;
  reviewers = REVIEWERS;  
  revisions = REVISION;  
  activities = ACTIVITIES;  
  properties = PROPERTIES;  
  downloads = DOWNLOADS;  
  active = 1;
  model: any = {};
  submitted:boolean;
  nodes = [
    {
      id: 0,
      node_name: 'Public',
      isExpanded: true,
      count: 10,
      parent_id : null,
      children: [
        
      ]
    }
  ];
  pathIds=[];
  parentId = null;
  //options = {};
  options: ITreeOptions = {
    actionMapping: {
        mouse: {
            click: (tree, node, $event) => {
              TREE_ACTIONS.ACTIVATE(tree, node, $event);
                const lineage = [];
                this.pathIds = [];
                // add clicked node as first item
                lineage.push(node.data);
                this.pathIds.push(node.data);
                this.parentId=node.data;
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
  constructor(private script:ScriptService, private router: Router,
    private documentApiService:DocumentApiService,
    private documentSidemenuService:DocumentSidemenuService,
    private localstorageService:LocalStorageService) { 
      // 'tableInit','modelView','chartBundle','docDetails'
    this.script.load('modelView').then(data => {
     // console.log('script loaded ', data);
      }).catch(error => console.log(error));
  }
  msgSubscription;
  docData:any;
  folderPathSubscription;
  folderPathData = [];
  getDocData(){
    this.msgSubscription = this.documentSidemenuService.currentMessage.subscribe(
      message => {
        if(message){
          this.docData = message;
        }
      });
      this.folderPathSubscription = this.documentSidemenuService.currentFolderPath.subscribe(
        message => {
          if(message){
            let pathStr = "";
            this.folderPathData = message;
          }
        });
  }
  navigateToPath(id){
    this.documentSidemenuService.changeNodeId(id);
  }
  ngOnInit(): void {
    this.getDocData();
    this.getDocumentTree();
    this.getRecentFileUploadsByUserId();
  }
  ngOnDestroy() {
    this.msgSubscription.unsubscribe();
  }
  clickHandler(event: any) {
   // console.log(this.treeComponent.treeModel.focusedNode.data);
    
}
openFolder(id){
  this.documentSidemenuService.changeNodeId(id);
}
  // Navigate Document details
  documentDetails(){
    // this.statusNotation = data  != null ? data : 0 ;
    // this.urlStatusFragment = data != 0 ? data == 1 ? "Approve" : "Review" : "view";
    //console.log(this.statusNotation, "=>", this.urlStatusFragment);
    //this.router.navigate(['/document-management/document-details'], {queryParams: { status: this.statusNotation }, fragment: this.urlStatusFragment });
    console.log(321);
    this.router.navigate(['/document-management/document-details']);
  }
downloadCount(dCountData){
  this.documentApiService.downloadCount(dCountData).subscribe(
    data=>{

    }
  )
}
  downloadMyFile(id,name,fid){
    let data = {document_id:id}
    var _this = this;
    this.documentApiService.getDocumentPath(data).subscribe(
      data => {
      console.log(data)
      fetch(environment.imageURL+data+name)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        let dCountData = {document_id:fid,user_id:_this.localstorageService.getValue().userId}
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
addFolder(){
  let pathStr = "";
  this.pathIds.slice(0).reverse().map(x=>{
    if(x.node_name)
    {pathStr = pathStr + x.node_name + '/';}
  })
  
  this.submitted = true;
      if(this.model.folder_name && this.model.folder_name.trim() != ""){
      this.model.created_by = localStorage.getItem("userId");
      this.model.path_ids = pathStr ;
      this.model.parent_id = this.parentId.id;
      this.documentApiService.createFolder(this.model).subscribe(
        data => {
          this.model.comment="";
          
          if(data.success){
            Swal.fire('Success', 'Folder Created', 'success');
          }
          else{
            Swal.fire('Error', 'Folder Name Already Exists', 'error');
          }
         // Swal.fire('Oops...', 'Something went wrong!', 'error')
        },
        err=>{})
      }
}
getDocumentTree(){
  // var data = {node_id : 0};
  // this.documentApiService.getDocumentTree(data).subscribe(
  //   data => {
  //    data.map(x=>{
  //      if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
  //      {
  //       x["children"] = [{}];
  //      }
  //      if(x.node_type == 2){
  //       let resArray = x.node_name.split(".");
  //       resArray.splice(resArray.length - 2, 1);
  //       x.node_name  = resArray.join('.');
  //     }
  //     this.nodes[0].children.push(x);
  //    })
     
  //    this.treeComponent.treeModel.update();
  //   },
  //   err=>{})
}
recentFiles =[];
getRecentFileUploadsByUserId(){
  var data = {user_id : localStorage.getItem("userId")};
  this.documentApiService.getRecentFileUploadsByUserId(data).subscribe(
    data => {
     data.map(x=>{
       if(x.child_id && x.child_id != null && x.child_id.split(",").length  > 0)
       {
        x["children"] = [{}];
       }
       if(x.node_type == 2){
         x.doc_approvers =JSON.parse(x.doc_approvers);
         x.doc_reviewers =JSON.parse(x.doc_reviewers);
         x.f_name = x.node_name;
        let resArray = x.node_name.split(".");
        resArray.splice(resArray.length - 2, 1);
        x.node_name  = resArray.join('.');
      }
      this.recentFiles.push(x); 
     })
    
    
    },
    err=>{})
}
toggleExpanded(event:any){

if(event.isExpanded){
  var data = {node_id : event.node.data.id};
  this.documentApiService.getDocumentTree(data).subscribe(
    data => {
     this.treeComponent.treeModel.getNodeById(event.node.data.id).data.children = [];
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
       this.treeComponent.treeModel.getNodeById(event.node.data.id).data.children.push(x);
     })
     this.treeComponent.treeModel.update();
    },
    err=>{})

}
}
}

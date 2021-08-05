import { createOfflineCompileUrlResolver } from '@angular/compiler';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivationEnd, ChildActivationEnd, NavigationEnd, NavigationStart, Router, RoutesRecognized } from '@angular/router';

import { AccountService } from '@app/_services';
import { ITreeOptions, TreeComponent, TREE_ACTIONS } from '@circlon/angular-tree-component';
// import { TREE_ACTIONS } from '@circlon/angular-tree-component/lib/angular-tree-component.module';
import { ExitStatus } from 'typescript';
import { DocumentModalService} from './document-modal.service'
interface Approver {
    name: string;
    date: string;
    status :string;
    role :string;
  }
  
  interface Reviewer {
    name: string;
    date: string;
    Status :string;
    role :string;
  }
    
const APPROVERS: Approver[] = [
    {
      name: 'Aarya',
      status : 'Approved',
      date: '2020-06-04',
      role : 'Manager'
    },
    {
      name: 'Bellamy Blake',
      status : 'Approved',
      date: '2020-05-11',
      role : 'Hosuekeeping'
    },
    {
      name: 'Johnas',
      status : 'Pending',
      date: '',
      role : 'Manager'
    },
    {
      name: 'Lexa',
      status : 'Approved',
      date: '2020-07-19',
      role : 'Receptionist'
    },
    {
      name: 'Octavia Blake',
      status : 'Approved',
      date: '2020-06-23',
      role : 'Receptionist'
    },
    {
      name: 'Nathen',
      status : 'Pending',
      date: '',
      role : 'Manager'
    },
    {
      name: 'Morocco',
      status : 'Approved',
      date: '2020-08-07',
      role : 'Receptionist'
    },
    {
      name: 'Ann Marie',
      status : 'Pending',
      date: '',
      role : 'Receptionist'
    }
  ];

  const REVIEWERS: Reviewer[] = [
    {
      name: 'Octavia Blake',
      Status: 'Reviewed',
      date: '2020-06-23',
      role : 'Excecutive chef'
    },
    {
      name: 'Nathen',
      Status: 'Pending',
      date: '',
      role : 'Manager'
    },
    {
      name: 'Morocco',
      Status: 'Reviewed',
      date: '2020-08-07',
      role : 'Hosue keeping'
    },
    {
      name: 'Ann Marie',
      Status: 'Pending',
      date: '',
      role : 'Excecutive chef'
    },
    {
      name: 'Aarya',
      Status: 'Pending',
      date: '',
      role : 'Manager'
    },
    {
      name: 'Bellamy Blake',
      Status: 'Reviewed',
      date: '2020-05-11',
      role : 'General Manager'
    },
    {
      name: 'Johnas',
      Status: 'Pending',
      date: '',
      role : 'Excecutive chef'
    },
    {
      name: 'Lexa',
      Status: 'Reviewed',
      date: '2020-07-19',
      role : 'Receptionist'
    },
  ];

@Component({ 
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent { 
    showSidemenu = true;
    approvers = APPROVERS;  
    reviewers = REVIEWERS;
    hideSidemenu(){
       this.showSidemenu = false;
    }
    ngOnInit(){
         
    }
   
    navBar:Boolean = false;
    header:Boolean = false;
    breadcrumb;
    modalSubscription:any;
    documentModalData:any;

    @ViewChild('tree') treeComponent: TreeComponent;
    nodes = [
      {
        id: 0,
        node_type: 1,
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
                console.log($($event.target));
                $($event.target).parent().parent()[0].style.background = "#b1bbff";
                  const lineage = [];
                  this.pathIds = [];
                  // add clicked node as first item
                  lineage.push(node.data);
                  this.pathIds.push(node.data);
                  this.parentId=node.data;
                  this.treeComponent.treeModel.setFocusedNode(node.data.id);
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
  
    constructor(private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        private documentModalService:DocumentModalService) {
          this.modalSubscription = this.documentModalService.currentMessage.subscribe(
            message => {
              this.documentModalData = message;
              console.log(message);
            });
            this.router.events.subscribe(event => {
                    if (event instanceof NavigationEnd) {
                       
                        if(event.url == '/document-management/upload-document'){
                            this.showSidemenu = false;
                           
                        }
                        else{
                            this.showSidemenu = true;
                            
                        }
                        if(event.url.startsWith('/document-management/document-details')){
                            this.showSidemenu = false;
                        }
                        switch(event.url) {
                            case '/document-management/upload-document':
                                this.breadcrumb = 1;
                              break;
                            case '/document-management/document-details':
                                this.breadcrumb =  2;
                              break;
                              
                              case '/document-management/document-audit-trails':
                                this.breadcrumb =  3;
                              break;
                              case '/document-management/advance-tracking':
                                this.breadcrumb =  4;
                              break;
                            default:
                                this.breadcrumb = 0;
                              // code block
                          }
            }})
    //  console.log(route.snapshot.firstChild.data);
     
    //    this.router.events.subscribe(event => {
    //     if (event instanceof NavigationEnd) {
           
    //         if(event.url == '/document-management/upload-document'){
    //             this.showSidemenu = false;
    //         }
    //         else{
    //             this.showSidemenu = true;
    //         }
    //         // if(event.snapshot.firstChild.routeConfig.path == 'upload-document'){
    //         //     this.showSidemenu = true;
               
    //         // }
    //         // else{
    //         //     this.showSidemenu = false;
    //         // }
    //         // this.showSidemenu = event.snapshot.root.firstChild.data['docSidemenu'] ?
    //         //                     event.snapshot.root.firstChild.data['docSidemenu'] :
    //         //                     true;
           
    //      }
    // });

    // this.router.events.subscribe(event => {
    //     if (event instanceof ChildActivationEnd && event.snapshot.routeConfig.data?.docSidemenu ) {
    //      console.log(event.snapshot.routeConfig.data);
    //      this.showSidemenu = event.snapshot.routeConfig.data['docSidemenu'] ?
    //      event.snapshot.routeConfig.data['docSidemenu'] :
    //                          false;
    //     }
    //   });
     
    }
   
   
}
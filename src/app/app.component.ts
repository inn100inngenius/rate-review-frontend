import { Component } from '@angular/core';

import { AccountService, LocalStorageService } from './_services';
import { User } from './_models';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { NotificationApiService } from '@app/pages/notification-api.service';
@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['./app.component.css'] })
export class AppComponent {
    user: User;
    navBar: Boolean = false;
    header: Boolean = false;
    headerMenu;
    userType;
    notifications: any = [];
    unreadCount = 0;
    userName = undefined;
    constructor(private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        private localStorageService: LocalStorageService,
        private notificationApiService: NotificationApiService) {

        this.userType = this.localStorageService.getValue().userType;
        this.userName = this.localStorageService.getValue().userName;

        this.accountService.user.subscribe(x => this.user = x);
        //     this.router.events.subscribe(event => {
        //         if(event instanceof NavigationStart){
        //             console.log('this is what your looking for ', event);  
        //          }
        //        } 

        //    );

        this.router.events.subscribe(event => {
            if (event instanceof RoutesRecognized) {
                this.userType = localStorage.getItem('userType');
                //  console.log(event.state.root.firstChild.data);
                this.navBar = event.state.root.firstChild.data['nav'] ?
                    event.state.root.firstChild.data['nav'] :
                    false;
                this.header = event.state.root.firstChild.data['header'] ?
                    event.state.root.firstChild.data['header'] :
                    false;
            }
        });
        if (this.localStorageService.getValue().userType) { this.getNotifications(); }
    }
    ngAfterViewInit(): void {


    }


    getNotifications() {
        var params = {
            user_id: this.localStorageService.getValue().userId,
            user_type: this.localStorageService.getValue().userType
        };

        this.notificationApiService.getNotificationsByUserId(params).subscribe(
            data => {
                //console.log(data);
                this.notifications = data;
                this.unreadCount = data.length > 0 ? data[0].unread_count : 0;
                this.notifications.map(x => {
                    let path = '';
                    if (x.type == 1) {
                        path = '/task-management/view/' + x.link_id;
                    }
                    else if (x.type == 2) {
                        path = '/document-management/document-details/' + x.link_id;
                    }
                    x.path = path;
                })
            })
    }

    readNotification(nid) {
        var params = { notification_id: nid };

        this.notificationApiService.readNotification(params).subscribe(
            data => {
                this.getNotifications();
            })
    }

    signout() {
        this.accountService.logout();
    }
}
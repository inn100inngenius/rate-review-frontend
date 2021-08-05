import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService,LocalStorageService } from '@app/_services';
import { NgxSpinnerService } from "ngx-spinner";
import { tap } from 'rxjs/operators';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService,private localStorageService:LocalStorageService,
        private SpinnerService: NgxSpinnerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        // const user = this.accountService.userValue;
        // const isLoggedIn = user && user.token;
        // const isApiUrl = request.url.startsWith(environment.apiUrl);
        // if (isLoggedIn && isApiUrl) {
        //     request = request.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${user.token}`
        //         }
        //     });
        // }
        let  urlNotIn =["https://jsonip.com","https://ipapi.co"];
        let isUrlIn =false;   
        urlNotIn.find(x=>
        //  if(request.url.startsWith(x)){return true}
        { if( request.url.startsWith(x)){
            isUrlIn = true;
         }
        } 
        )
        //alert(isUrlIn);
        if(!isUrlIn){
          this.SpinnerService.show();
        request = request.clone({
                withCredentials:true
        });
       }
        // request = request.clone({
        //     withCredentials:true
        //         });
        // request = request.clone({ 
        //    // headers: request.headers.set('Accept', 'application/json'),
        //     body: {...request.body,
        //          ip:this.localStorageService.getValue().ip,
        //         country_name:this.localStorageService.getValue().countryName}});
       // return next.handle(request);


        return next.handle(request).pipe(
            tap(evt => {
                if (evt instanceof HttpResponse) {
                    this.SpinnerService.hide();
                   
                        // this.toasterService.success(evt.body.success.message, evt.body.success.title, { positionClass: 'toast-bottom-center' });
                }
            }));
            // catchError((err: any) => {
            //     if(err instanceof HttpErrorResponse) {
            //         try {
            //             this.toasterService.error(err.error.message, err.error.title, { positionClass: 'toast-bottom-center' });
            //         } catch(e) {
            //             this.toasterService.error('An error occurred', '', { positionClass: 'toast-bottom-center' });
            //         }
            //         //log error 
            //     }
            //     return of(err);
            // }));
    
      
    }
}
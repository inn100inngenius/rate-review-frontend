import { Component,  OnInit } from '@angular/core';
import { BreadcrumbService } from '@app/_services';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent implements OnInit {
  items:any = [];
  msgSubscription;
  constructor(private ser: BreadcrumbService) {

   }
  
  ngOnInit(): void {
    this.msgSubscription = this.ser.currentMessage.subscribe(message => {this.items = message;});
  }
  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.msgSubscription.unsubscribe();
  }


}

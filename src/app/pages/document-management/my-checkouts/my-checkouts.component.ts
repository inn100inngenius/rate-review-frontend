import { Component, OnInit } from '@angular/core';
import { ScriptService } from '@app/_services/script.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-checkouts',
  templateUrl: './my-checkouts.component.html',
  styleUrls: ['./my-checkouts.component.less'],
  providers: [ScriptService]
})
export class MyCheckoutsComponent implements OnInit {

  statusNotation: number;
  urlStatusFragment: string;

  constructor(private script: ScriptService, private router: Router) {
    this.script.load('tableInit', 'modelView').then(data => {
      console.log('script loaded ', data);
    }).catch(error => console.log(error));
  }


  ngOnInit(): void {
  }

  // Navigate Document details
  documentDetails(data) {
    this.statusNotation = data != null ? data : 0;
    this.urlStatusFragment = data != 0 ? data == 1 ? "Approve" : "Review" : "view";
    console.log(this.statusNotation, "=>", this.urlStatusFragment);

    this.router.navigate(['/document-management/document-details'], { queryParams: { status: this.statusNotation }, fragment: this.urlStatusFragment });
  }
}

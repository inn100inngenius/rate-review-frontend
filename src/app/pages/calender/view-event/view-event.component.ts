import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}

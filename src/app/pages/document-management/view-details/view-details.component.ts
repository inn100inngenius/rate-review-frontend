import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScriptService } from '@app/_services/script.service';


interface Approver {
  name: string;
  status: number;
  date: string;
}

interface Reviewer {
  name: string;
  status: number;
  date: string;
}

const APPROVER: Approver[] = [
  {
    name: 'Bellamy Blake',
    status: 1,
    date: '2020-05-11'
  },
  {
    name: 'Johnas ',
    status: 0,
    date: '2020-05-16'
  },
  {
    name: 'Aarya',
    status: 1,
    date: '2020-06-04'
  },
  {
    name: 'Octavia Blake',
    status: 0,
    date: '2020-06-23'
  },
  {
    name: 'Lexa',
    status: 1,
    date: '2020-07-19'
  },
  {
    name: 'Madi Griffin',
    status: 0,
    date: '2020-07-30'
  }
];

const REVIEWER: Reviewer[] = [
  {
    name: 'Bellamy Blake',
    status: 1,
    date: '2020-05-11'
  },
  {
    name: 'Johnas ',
    status: 0,
    date: '2020-05-16'
  },
  {
    name: 'Aarya',
    status: 1,
    date: '2020-06-04'
  },
  {
    name: 'Octavia Blake',
    status: 0,
    date: '2020-06-23'
  },
  {
    name: 'Lexa',
    status: 1,
    date: '2020-07-19'
  },
  {
    name: 'Madi Griffin',
    status: 0,
    date: '2020-07-30'
  }
];

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.less'],
  providers: [ ScriptService ]
})
export class ViewDetailsComponent implements OnInit {
  page = 1;
  pageSize = 5;
  approver: Approver[];
  reviewer: Reviewer[];
  otpForm : FormGroup;
  searchTerm: "";

  nodes = [
    {
      id: 1,
      name: 'Public',      
      count: 10,
      isExpanded: true,
      children: [
        { id: 2, name: 'Folder 1', count: 2 },
        { id: 3, name: 'Folder 2', count: 1 },
        { id: 4, name: 'Folder 3', count: 0 },
        { id: 5, name: 'Folder 4', count: 0 },
        { id: 6, name: 'Folder 5', count: 4 },
        { id: 7, name: 'Folder 6', count: 1 },
        { id: 8, name: 'Folder 7', count: 6 },
        { id: 9, name: 'Folder 8', count: 0 },
        { id: 10, name: 'Folder 9', count: 2 },
        { id: 11, name: 'Folder 10', count: 1 },
      ]
    },
   
  ];
  options = {};
  
  constructor(private script:ScriptService, private formBuilder: FormBuilder) {
    this.refreshData();
    this.script.load('tableInit').then(data => {
      console.log('script loaded ', data);
      }).catch(error => console.log(error));
   }

  ngOnInit(): void {
    this.otpForm = this.formBuilder.group({
      approver: ['']
    }); 
    this.otpForm = this.formBuilder.group({
      reviewer: ['']
    }); 
  }

  // Pagination
  refreshData() {
    this.approver = APPROVER
      .map((app, i) => ({id: i + 1, ...app}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

    this.reviewer = REVIEWER
      .map((app, i) => ({id: i + 1, ...app}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }

}

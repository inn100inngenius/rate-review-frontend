import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {
  nodes = [
    {
      id: 1,
      name: 'Folder 1',
      children: [
        { id: 2, name: 'Folder 1.1' },
        { id: 3, name: 'Folder 1.2' },
        { id: 4, name: 'Folder 1.3' },
        { id: 5, name: 'Folder 1.4' }
      ]
    },
    {
      id: 6,
      name: 'Folder 2',
      children: [
        { id: 7, name: 'Folder 2.1' },
        { id: 8, name: 'Folder 2.2' },
        { id: 9, name: 'Folder 2.3' },
        {
          id: 10,
          name: 'Folder 2.4',
          children: [
            { id: 11, name: 'Folder 2.4.1' }
          ]
        }
      ]
    },
    {
      id: 12,
      name: 'Folder 3',
      children: [
        { id: 13, name: 'Folder 3.1' },
        { id: 14, 
          name: 'Folder 3.2',
          children: [
            { id: 15, name: 'Folder 3.2.1' }
          ]
        },
        { id: 16, name: 'Folder 3.3' },
        { id: 17, name: 'Folder 3.4'}
      ]
    },
    { id: 18, name: 'Folder 4' },
    { id: 19, name: 'Folder 5' },
    { id: 20, name: 'Folder 6',
      children: [
        { id: 24, name: 'Folder 6.1' },
        { id: 25, name: 'Folder 6.2' },
        { id: 26, name: 'Folder 6.3' },
        {
          id: 27,
          name: 'Folder 6.4',
          children: [
            { id: 11, name: 'Folder 6.4.1' }
          ]
        }
      ]
    },
    { id: 21, name: 'Folder 7' },
    { id: 22, name: 'Folder 8',
      children: [
        { id: 29, name: 'Folder 8.1' },
        { id: 30, name: 'Folder 8.2' },
        { id: 31, name: 'Folder 8.3' },
        {
          id: 32,
          name: 'Folder 8.4',
          children: [
            { id: 33, name: 'Folder 8.4.1' }
          ]
        }
      ]
    },
    { id: 23, name: 'Folder n' },
  ];
  options = {};

  constructor() { }

  ngOnInit(): void {
  }

}


 
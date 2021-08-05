import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRejectedDocumentsComponent } from './my-rejected-documents.component';

describe('MyRejectedDocumentsComponent', () => {
  let component: MyRejectedDocumentsComponent;
  let fixture: ComponentFixture<MyRejectedDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRejectedDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRejectedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSidemenuComponent } from './document-sidemenu.component';

describe('DocumentSidemenuComponent', () => {
  let component: DocumentSidemenuComponent;
  let fixture: ComponentFixture<DocumentSidemenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSidemenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSidemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

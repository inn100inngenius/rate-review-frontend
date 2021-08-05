import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAuditComponent } from './document-audit.component';

describe('DocumentAuditComponent', () => {
  let component: DocumentAuditComponent;
  let fixture: ComponentFixture<DocumentAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelpopComponent } from './modelpop.component';

describe('ModelpopComponent', () => {
  let component: ModelpopComponent;
  let fixture: ComponentFixture<ModelpopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelpopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelpopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

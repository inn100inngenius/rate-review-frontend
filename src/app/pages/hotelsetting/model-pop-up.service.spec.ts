import { TestBed } from '@angular/core/testing';

import { ModelPopUpService } from './model-pop-up.service';

describe('ModelPopUpService', () => {
  let service: ModelPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

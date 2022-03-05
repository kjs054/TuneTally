import { TestBed } from '@angular/core/testing';

import { DynamicColorService } from './dynamic-color-service.service';

describe('DynamicColorServiceService', () => {
  let service: DynamicColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

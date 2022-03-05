import { TestBed } from '@angular/core/testing';

import { AppMessageQueueServiceService } from './app-message-queue-service.service';

describe('AppMessageQueueServiceService', () => {
  let service: AppMessageQueueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMessageQueueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

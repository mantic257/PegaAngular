import { TestBed, inject } from '@angular/core/testing';

import { ReviewCaseService } from './review-case-service.service';

describe('ReviewCaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewCaseService]
    });
  });

  it('should be created', inject([ReviewCaseService], (service: ReviewCaseService) => {
    expect(service).toBeTruthy();
  }));
});

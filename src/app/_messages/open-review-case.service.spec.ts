import { TestBed, inject } from '@angular/core/testing';

import { OpenReviewCaseService } from './open-review-case.service';

describe('OpenReviewCaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenReviewCaseService]
    });
  });

  it('should be created', inject([OpenReviewCaseService], (service: OpenReviewCaseService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';

describe('JobService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationService = TestBed.get(LocationService);
    expect(service).toBeTruthy();
  });
});

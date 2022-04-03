import { TestBed } from '@angular/core/testing';

import { FakeUploaderService } from './fake-uploader.service';

describe('FakeUploaderService', () => {
  let service: FakeUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FakeUploaderService] });
    service = TestBed.inject(FakeUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

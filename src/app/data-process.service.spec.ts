import { TestBed } from '@angular/core/testing';

import { DataProcessService } from './data-process.service';

describe('DataProcessService', () => {
  let service: DataProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ProgCompilerService } from './prog-compiler.service';

describe('ProgCompilerService', () => {
  let service: ProgCompilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgCompilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

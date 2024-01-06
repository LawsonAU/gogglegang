import { TestBed } from '@angular/core/testing';

import { CraftCalculatorService } from './craft-calculator.service';

describe('CraftCalculatorService', () => {
  let service: CraftCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CraftCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

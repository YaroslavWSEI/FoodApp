import { TestBed } from '@angular/core/testing';
import { CuisinesService } from './cuisines';

describe('CuisinesService', () => {
  let service: CuisinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuisinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
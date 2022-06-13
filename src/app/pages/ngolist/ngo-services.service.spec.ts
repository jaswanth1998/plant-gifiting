import { TestBed } from '@angular/core/testing';

import { NgoServicesService } from './ngo-services.service';

describe('NgoServicesService', () => {
  let service: NgoServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgoServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

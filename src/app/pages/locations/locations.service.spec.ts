import { TestBed } from '@angular/core/testing';
import { locationservice } from './locations.service';



describe('EcardService', () => {
  let service: locationservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(locationservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

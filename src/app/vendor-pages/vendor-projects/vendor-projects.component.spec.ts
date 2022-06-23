import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorProjectsComponent } from './vendor-projects.component';

describe('VendorProjectsComponent', () => {
  let component: VendorProjectsComponent;
  let fixture: ComponentFixture<VendorProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

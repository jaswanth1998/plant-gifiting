import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDrawerComponent } from './common-drawer.component';

describe('CommonDrawerComponent', () => {
  let component: CommonDrawerComponent;
  let fixture: ComponentFixture<CommonDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

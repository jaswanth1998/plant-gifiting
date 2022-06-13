import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonnViewDrawerComponent } from './commonn-view-drawer.component';

describe('CommonnViewDrawerComponent', () => {
  let component: CommonnViewDrawerComponent;
  let fixture: ComponentFixture<CommonnViewDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonnViewDrawerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonnViewDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

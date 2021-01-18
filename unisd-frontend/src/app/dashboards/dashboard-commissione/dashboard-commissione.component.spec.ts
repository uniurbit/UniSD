import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCommissioneComponent } from './dashboard-commissione.component';

describe('DashboardCommissioneComponent', () => {
  let component: DashboardCommissioneComponent;
  let fixture: ComponentFixture<DashboardCommissioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCommissioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCommissioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

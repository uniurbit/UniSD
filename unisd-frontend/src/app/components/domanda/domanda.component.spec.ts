import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomandaComponent } from './domanda.component';

describe('DomandaComponent', () => {
  let component: DomandaComponent;
  let fixture: ComponentFixture<DomandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

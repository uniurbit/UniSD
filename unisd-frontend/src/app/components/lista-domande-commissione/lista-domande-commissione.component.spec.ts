import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDomandeCommissioneComponent } from './lista-domande-commissione.component';

describe('ListaDomandeCommissioneComponent', () => {
  let component: ListaDomandeCommissioneComponent;
  let fixture: ComponentFixture<ListaDomandeCommissioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaDomandeCommissioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDomandeCommissioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

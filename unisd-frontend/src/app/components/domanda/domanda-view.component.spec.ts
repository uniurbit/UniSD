import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomandaViewComponent } from './domanda-view.component';

describe('DomandaViewComponent', () => {
  let component: DomandaViewComponent;
  let fixture: ComponentFixture<DomandaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomandaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomandaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

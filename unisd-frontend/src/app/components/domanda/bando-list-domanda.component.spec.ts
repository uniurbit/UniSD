import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandoListDomandaComponent } from './bando-list-domanda.component';

describe('BandoListDomandaComponent', () => {
  let component: BandoListDomandaComponent;
  let fixture: ComponentFixture<BandoListDomandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandoListDomandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandoListDomandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

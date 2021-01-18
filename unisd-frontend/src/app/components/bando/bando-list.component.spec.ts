import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandoListComponent } from './bando-list.component';

describe('BandoListComponent', () => {
  let component: BandoListComponent;
  let fixture: ComponentFixture<BandoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

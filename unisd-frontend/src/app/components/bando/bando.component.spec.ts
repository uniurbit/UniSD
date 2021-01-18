import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandoComponent } from './bando.component';

describe('BandoComponent', () => {
  let component: BandoComponent;
  let fixture: ComponentFixture<BandoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

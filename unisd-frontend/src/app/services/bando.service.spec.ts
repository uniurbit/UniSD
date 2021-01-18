import { TestBed } from '@angular/core/testing';

import { BandoService } from './bando.service';

describe('BandoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BandoService = TestBed.get(BandoService);
    expect(service).toBeTruthy();
  });
});

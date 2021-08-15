import { TestBed } from '@angular/core/testing';

import { AvtentikacijaService } from './avtentikacija.service';

describe('AvtentikacijaService', () => {
  let service: AvtentikacijaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvtentikacijaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

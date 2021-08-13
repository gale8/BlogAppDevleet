import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeznamBlogovComponent } from './seznam-blogov.component';

describe('SeznamBlogovComponent', () => {
  let component: SeznamBlogovComponent;
  let fixture: ComponentFixture<SeznamBlogovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeznamBlogovComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeznamBlogovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

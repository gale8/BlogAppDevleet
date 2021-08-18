import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrediKomentarComponent } from './uredi-komentar.component';

describe('UrediKomentarComponent', () => {
  let component: UrediKomentarComponent;
  let fixture: ComponentFixture<UrediKomentarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrediKomentarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrediKomentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

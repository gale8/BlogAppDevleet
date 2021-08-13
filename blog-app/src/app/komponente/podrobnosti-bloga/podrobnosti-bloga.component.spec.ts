import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodrobnostiBlogaComponent } from './podrobnosti-bloga.component';

describe('PodrobnostiBlogaComponent', () => {
  let component: PodrobnostiBlogaComponent;
  let fixture: ComponentFixture<PodrobnostiBlogaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodrobnostiBlogaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PodrobnostiBlogaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

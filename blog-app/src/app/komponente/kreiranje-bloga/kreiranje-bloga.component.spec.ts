import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KreiranjeBlogaComponent } from './kreiranje-bloga.component';

describe('KreiranjeBlogaComponent', () => {
  let component: KreiranjeBlogaComponent;
  let fixture: ComponentFixture<KreiranjeBlogaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KreiranjeBlogaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KreiranjeBlogaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

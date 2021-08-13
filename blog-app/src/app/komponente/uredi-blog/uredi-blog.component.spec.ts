import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrediBlogComponent } from './uredi-blog.component';

describe('UrediBlogComponent', () => {
  let component: UrediBlogComponent;
  let fixture: ComponentFixture<UrediBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrediBlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrediBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

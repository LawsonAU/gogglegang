import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayOutletComponent } from './display-outlet.component';

describe('DisplayOutletComponent', () => {
  let component: DisplayOutletComponent;
  let fixture: ComponentFixture<DisplayOutletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayOutletComponent]
    });
    fixture = TestBed.createComponent(DisplayOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

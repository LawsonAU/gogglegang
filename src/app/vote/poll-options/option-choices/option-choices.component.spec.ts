import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionChoicesComponent } from './option-choices.component';

describe('OptionChoicesComponent', () => {
  let component: OptionChoicesComponent;
  let fixture: ComponentFixture<OptionChoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionChoicesComponent]
    });
    fixture = TestBed.createComponent(OptionChoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

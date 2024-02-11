import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletePollComponent } from './complete-poll.component';

describe('CompletePollComponent', () => {
  let component: CompletePollComponent;
  let fixture: ComponentFixture<CompletePollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletePollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompletePollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRecepeRequestComponent } from './show-recepe-request.component';

describe('ShowRecepeRequestComponent', () => {
  let component: ShowRecepeRequestComponent;
  let fixture: ComponentFixture<ShowRecepeRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowRecepeRequestComponent]
    });
    fixture = TestBed.createComponent(ShowRecepeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

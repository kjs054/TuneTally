import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTrackComponent } from './rate-track.component';

describe('RateTrackComponent', () => {
  let component: RateTrackComponent;
  let fixture: ComponentFixture<RateTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

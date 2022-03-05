import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscographyResultComponent } from './discography-result.component';

describe('DiscographyResultComponent', () => {
  let component: DiscographyResultComponent;
  let fixture: ComponentFixture<DiscographyResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscographyResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscographyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

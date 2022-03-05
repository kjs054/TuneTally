import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePageComponent } from './release-page.component';

describe('ReleasePageComponent', () => {
  let component: ReleasePageComponent;
  let fixture: ComponentFixture<ReleasePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

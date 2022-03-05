import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultRowComponent } from './result-row.component';

describe('ResultRowComponent', () => {
  let component: ResultRowComponent;
  let fixture: ComponentFixture<ResultRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

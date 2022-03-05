import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSidebarComponent } from './analytics-sidebar.component';

describe('AnalyticsSidebarComponent', () => {
  let component: AnalyticsSidebarComponent;
  let fixture: ComponentFixture<AnalyticsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

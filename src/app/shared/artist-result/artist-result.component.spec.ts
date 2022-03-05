import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistResultComponent } from './artist-result.component';

describe('ArtistResultComponent', () => {
  let component: ArtistResultComponent;
  let fixture: ComponentFixture<ArtistResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

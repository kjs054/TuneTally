import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistBannerComponent } from './artist-banner.component';

describe('ArtistBannerComponent', () => {
  let component: ArtistBannerComponent;
  let fixture: ComponentFixture<ArtistBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

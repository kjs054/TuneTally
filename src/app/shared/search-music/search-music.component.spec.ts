import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchMusicComponent } from './search-music.component';

describe('SearchMusicComponent', () => {
  let component: SearchMusicComponent;
  let fixture: ComponentFixture<SearchMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

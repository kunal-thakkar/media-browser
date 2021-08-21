import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentFinderComponent } from './torrent-finder.component';

describe('TorrentFinderComponent', () => {
  let component: TorrentFinderComponent;
  let fixture: ComponentFixture<TorrentFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorrentFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

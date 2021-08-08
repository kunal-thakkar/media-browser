import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCollectionComponent } from './media-collection.component';

describe('MediaCollectionComponent', () => {
  let component: MediaCollectionComponent;
  let fixture: ComponentFixture<MediaCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

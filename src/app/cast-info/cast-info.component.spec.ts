import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastInfoComponent } from './cast-info.component';

describe('CastInfoComponent', () => {
  let component: CastInfoComponent;
  let fixture: ComponentFixture<CastInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

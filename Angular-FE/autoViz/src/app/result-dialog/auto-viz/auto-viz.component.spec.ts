import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoVizComponent } from './auto-viz.component';

describe('AutoVizComponent', () => {
  let component: AutoVizComponent;
  let fixture: ComponentFixture<AutoVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoVizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

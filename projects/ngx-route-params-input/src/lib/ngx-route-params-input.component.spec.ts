import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxRouteParamsInputComponent } from './ngx-route-params-input.component';

describe('NgxRouteParamsInputComponent', () => {
  let component: NgxRouteParamsInputComponent;
  let fixture: ComponentFixture<NgxRouteParamsInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRouteParamsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRouteParamsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

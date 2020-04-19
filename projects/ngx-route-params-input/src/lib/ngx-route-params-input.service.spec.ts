import { TestBed } from '@angular/core/testing';

import { NgxRouteParamsInputService } from './ngx-route-params-input.service';

describe('NgxRouteParamsInputService', () => {
  let service: NgxRouteParamsInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxRouteParamsInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

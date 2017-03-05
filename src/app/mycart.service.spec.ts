/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MycartService } from './mycart.service';

describe('MycartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MycartService]
    });
  });

  it('should ...', inject([MycartService], (service: MycartService) => {
    expect(service).toBeTruthy();
  }));
});

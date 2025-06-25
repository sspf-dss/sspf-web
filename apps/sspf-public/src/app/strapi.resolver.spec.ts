import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { strapiResolver } from './strapi.resolver';

describe('strapiResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => strapiResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});

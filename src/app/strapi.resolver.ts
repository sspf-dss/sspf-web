import { ResolveFn } from '@angular/router';
import { StrapiStore } from './store/strapi.store';
import { inject } from '@angular/core';

export const strapiResolver: ResolveFn<boolean> = (route, state) => {
  const strapiStore = inject(StrapiStore);

  return strapiStore.user();
};

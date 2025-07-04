import { ResolveFn } from '@angular/router';
import { StrapiStore } from './store/strapi.store';
import { inject } from '@angular/core';
import { User } from '@sspf/cms-types';

export const strapiResolver: ResolveFn<User> = (route, state) => {
  const strapiStore = inject(StrapiStore);

  return strapiStore.user()!;
};

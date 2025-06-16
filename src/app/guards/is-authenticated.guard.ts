import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { StrapiStore } from '../store/strapi.store';
import { from, map, tap } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthStore);

  const authenticated = auth.authenticated ?? false;

  if (authenticated) {
    return true;
  } else {
    auth.login();
    return false;
  }
};

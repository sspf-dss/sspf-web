import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthStore } from '../store/auth.store';

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

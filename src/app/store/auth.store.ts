import { computed, inject, resource } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEvent,
  KeycloakEventType,
  ReadyArgs,
  typeEventArgs,
} from 'keycloak-angular';
import Keycloak, { KeycloakProfile } from 'keycloak-js';

type AuthState = {
  isAuthenticated: boolean;
  token?: string;
};

const initAuthState: AuthState = {
  isAuthenticated: false,
  token: undefined,
};

export const GUEST_PROFILE: KeycloakProfile = {};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initAuthState),
  withProps(() => ({
    _keycloak: inject(Keycloak),
    _keycloakEventSignal: inject(KEYCLOAK_EVENT_SIGNAL),
  })),
  withProps((store) => ({
    userProfileResource: resource({
      params: store.isAuthenticated,
      loader: ({ params: isAuthenticated }) => {
        if (isAuthenticated) return store._keycloak.loadUserProfile();
        return Promise.resolve(GUEST_PROFILE);
      },
    }),
  })),
  withComputed((store) => ({
    hasAuthenticated: computed(() =>
      store.isAuthenticated() ? true : undefined
    ),
    profile: computed(() => store.userProfileResource.value()),
  })),
  withMethods((store) => ({
    login: () => {
      store._keycloak.login();
    },
    logout: () => {
      store._keycloak.logout();
    },
  })),
  withMethods((store) => ({
    _updateAuth: signalMethod<KeycloakEvent>((event) => {
      console.log(event);
      if (event.type === KeycloakEventType.Ready) {
        patchState(store, {
          isAuthenticated: typeEventArgs<ReadyArgs>(event.args),
          token: store._keycloak.token,
        });
      } else if (event.type === KeycloakEventType.AuthLogout) {
        patchState(store, { isAuthenticated: false, token: undefined });
      } else if (event.type === KeycloakEventType.AuthRefreshSuccess) {
        patchState(store, {
          isAuthenticated: true,
          token: store._keycloak.token,
        });
      } else {
        patchState(store, { isAuthenticated: false, token: undefined });
      }
    }),
  })),
  withHooks({
    onInit(store) {
      store._updateAuth(store._keycloakEventSignal);
    },
  })
);

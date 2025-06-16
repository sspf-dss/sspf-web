import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { AuthStore } from './auth.store';
import { computed, effect, inject, resource, signal } from '@angular/core';
import { paths } from '../lib/openapi/sspf-cms';
import createClient, { Client, Middleware } from 'openapi-fetch';
import { strapi, StrapiClient } from '@strapi/client';
import { toObservable } from '@angular/core/rxjs-interop';

type StrapiState = {
  client1: Client<paths>;
  client: StrapiClient;
  isReady: boolean;
};

const STRAPI_URL = 'http://localhost:1338';

const BASE_URL = `${STRAPI_URL}/api`;

const initialState: StrapiState = {
  client1: createClient<paths>({ baseUrl: BASE_URL }),
  client: strapi({ baseURL: BASE_URL }),
  isReady: false,
};

export const StrapiStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withProps(() => ({
    _authStore: inject(AuthStore),
    _middleware: {
      onRequest() {
        return undefined;
      },
    } as Middleware,
  })),
  withProps(({ isReady }) => ({
    isReady$: toObservable(isReady),
  })),
  withProps((store) => ({
    _strapiProviderAuthResource: resource({
      params: store._authStore.token,
      loader: async ({ params: token }) => {
        const res = await fetch(
          `${STRAPI_URL}/api/auth/keycloak/callback?access_token=${token}`,
        );
        return await res.json();
      },
    }),
  })),
  withComputed((store) => ({
    _strapiJwt: computed(() => {
      const strapiProviderAuth = store._strapiProviderAuthResource.value();
      if (strapiProviderAuth) {
        return strapiProviderAuth.jwt;
      }
      return undefined;
    }),
  })),
  withComputed((store) => ({
    hasJwt: computed(() => {
      return store._strapiJwt() == undefined ? undefined : true;
    }),
    user: computed(() => {
      if (store._strapiProviderAuthResource.hasValue()) {
        return store._strapiProviderAuthResource.value()?.user;
      } else {
        return undefined;
      }
    }),
  })),
  withMethods((store) => ({
    url: (path: string) => {
      return STRAPI_URL + path;
    },
  })),
  withHooks((store) => ({
    onInit: () => {
      effect(() => {
        if (store._strapiJwt()) {
          patchState(store, {
            client: strapi({
              baseURL: BASE_URL,
              headers: { Authorization: `Bearer ${store._strapiJwt()}` },
            }),
            isReady: true,
          });
        } else {
          patchState(store, {
            client: strapi({ baseURL: BASE_URL }),
            isReady: false,
          });
        }
      });
    },
  })),
);

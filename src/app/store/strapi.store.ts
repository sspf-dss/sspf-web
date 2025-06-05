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
import { computed, effect, inject, resource } from '@angular/core';
import { paths } from '../lib/openapi/sspf-cms';
import createClient, { Client, Middleware } from 'openapi-fetch';
import { UserRegistration } from '../lib/openapi/sspf-cms-type';
import { strapi, StrapiClient } from '@strapi/client';

type StrapiState = {
  client1: Client<paths>;
  client: StrapiClient;
};

const STRAPI_URL = 'http://localhost:1337';
const BASE_URL = `${STRAPI_URL}/api`;

const initialState: StrapiState = {
  client1: createClient<paths>({ baseUrl: BASE_URL }),
  client: strapi({ baseURL: BASE_URL }),
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
  withProps((store) => ({
    _strapiProviderAuthResource: resource({
      params: store._authStore.token,
      loader: async ({ params: token }) => {
        const res = await fetch(
          `${STRAPI_URL}/api/auth/keycloak/callback?access_token=${token}}`
        );
        return await (res.json() as Promise<UserRegistration>);
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
          });
        } else {
          patchState(store, { client: strapi({ baseURL: BASE_URL }) });
        }
      });
    },
  }))
);

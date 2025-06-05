/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeTH from '@angular/common/locales/th';

registerLocaleData(localeTH);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);

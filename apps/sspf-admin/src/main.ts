import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeTH from '@angular/common/locales/th';

registerLocaleData(localeTH);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

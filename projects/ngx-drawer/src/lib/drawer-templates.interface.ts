// drawer-templates.interface.ts
import { TemplateRef, EventEmitter } from '@angular/core';

export interface HasDrawerTemplates {
  headerTpl?: TemplateRef<any>;
  footerTpl?: TemplateRef<any>;
  close?: EventEmitter<any>;
  output?: EventEmitter<any>;
}

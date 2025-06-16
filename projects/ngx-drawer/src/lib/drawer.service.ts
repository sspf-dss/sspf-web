import {
  ComponentRef,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';
import { DrawerComponent } from './drawer';
import { DrawerConfig, DrawerMode, DrawerPosition } from './drawer.config';
import { HasDrawerTemplates } from './drawer-templates.interface';

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private overlayRef: OverlayRef | null = null;
  drawerModeChange = new BehaviorSubject<DrawerConfig['mode']>('over');

  constructor(
    private overlay: Overlay,
    private injector: Injector,
  ) {}

  open<T>(
    component: Type<T & HasDrawerTemplates>,
    viewContainerRef: ViewContainerRef,
    config: DrawerConfig & { onOutput?: (instance: T) => void } = {},
  ) {
    this.close();

    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().right('0').top('0'),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      width: config.width ?? '400px',
      height: config.height ?? '100vh',
    };

    this.overlayRef = this.overlay.create(overlayConfig);
    const drawerPortal = new ComponentPortal(DrawerComponent, viewContainerRef);
    const drawerRef = this.overlayRef.attach(drawerPortal);
    drawerRef.instance.width = config.width ?? '400px';
    drawerRef.instance.height = config.height ?? '100vh';

    const bodyPortal = new ComponentPortal(component, viewContainerRef);
    const bodyRef: ComponentRef<any> =
      drawerRef.instance.attachBody(bodyPortal);

    // Pass data from config to the component instance
    if (config.inputs && typeof config.inputs === 'object') {
      Object.keys(config.inputs).forEach((key) => {
        // Check if the property exists on the instance to avoid errors
        if (key in bodyRef.instance) {
          (bodyRef.instance as any)[key] = (config.inputs as any)[key];
        }
      });
    }

    const inst = bodyRef.instance as HasDrawerTemplates;
    if (inst.headerTpl) {
      drawerRef.instance.headerPortal = new TemplatePortal(
        inst.headerTpl,
        viewContainerRef,
      );
    }
    if (inst.footerTpl) {
      drawerRef.instance.footerPortal = new TemplatePortal(
        inst.footerTpl,
        viewContainerRef,
      );
    }
    if (inst.close?.subscribe) {
      inst.close.subscribe(() => drawerRef.instance.startClose());
    }

    // ✅ Handle outputs via callback
    if (config.onOutput) {
      config.onOutput(bodyRef.instance);
    }

    if (config.backdropClose !== false)
      this.overlayRef
        .backdropClick()
        .subscribe(() => drawerRef.instance.startClose());

    drawerRef.instance.close.subscribe(() => this.close());

    if (config.backdropClose !== false) {
      this.overlayRef
        .backdropClick()
        .subscribe(() => drawerRef.instance.startClose());
    }
  }

  close() {
    this.drawerModeChange.next('over');
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}

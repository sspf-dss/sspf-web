import {
  Component,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  HostListener,
  ComponentRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkPortalOutlet,
  PortalModule,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DrawerPosition } from './drawer.config';

@Component({
  selector: 'ngx-drawer',
  standalone: true,
  imports: [
    CommonModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    CdkPortalOutlet,
  ],
  templateUrl: './drawer.html',
  styleUrls: ['./drawer.scss'],
})
export class DrawerComponent implements AfterViewInit {
  @Input() position: DrawerPosition = 'right';
  @Input() width?: string;
  @Input() height?: string;
  @Input() headerPortal?: TemplatePortal<any>;
  //@Input() bodyPortal?: ComponentPortal<any> | TemplatePortal<any>;
  @Input() footerPortal?: TemplatePortal<any>;

  @Output() close = new EventEmitter<void>();
  @ViewChild('bodyOutlet', { static: true }) bodyOutlet!: CdkPortalOutlet;

  isVisible = false;
  isClosing = false;

  ngAfterViewInit() {
    setTimeout(() => (this.isVisible = true), 0);
  }

  attachBody<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this.bodyOutlet.attachComponentPortal(portal);
  }

  startClose() {
    this.isClosing = true;
    this.isVisible = false;
  }

  onAnimationEnd() {
    if (this.isClosing) this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (!this.isClosing) this.startClose();
  }
}

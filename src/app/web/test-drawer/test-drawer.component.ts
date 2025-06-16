import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  TemplateRef,
  ViewChild,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DrawerService } from 'ngx-drawer';
import { HasDrawerTemplates } from '../../../../projects/ngx-drawer/src/lib/drawer-templates.interface';

@Component({
  selector: 'app-test-drawer',
  imports: [MatButtonModule],
  templateUrl: './test-drawer.component.html',
  styleUrl: './test-drawer.component.scss',
})
export class TestDrawerComponent {
  @ViewChild('footer') footerTpl!: TemplateRef<any>;
  isPushed = false;
  private readonly vcr = inject(ViewContainerRef);

  constructor(public drawer: DrawerService) {
    this.drawer.drawerModeChange.subscribe((mode) => {
      this.isPushed = mode === 'push';
    });
  }

  openDrawer() {
    // this.drawer.openWithSlots({
    //   body: new ComponentPortal(DemoContentComponent),
    //   footer: new TemplatePortal(this.footerTpl, null!),
    // });

    this.drawer.open(DemoContentComponent, this.vcr);
  }
}

@Component({
  standalone: true,
  selector: 'demo-content',
  imports: [MatButtonModule],
  template: `
    <ng-template #header> 🚀 {{ headerTxt }} </ng-template>

    <ng-template #footer>
      <button mat-button (click)="onClose()">Cancel</button>
      <button mat-button>Save</button>
    </ng-template>

    Hello Drawer <button mat-button (click)="headerTxt = 'xxx'">change!</button>
  `,
})
export class DemoContentComponent implements HasDrawerTemplates {
  constructor(private readonly drawer: DrawerService) {}
  @ViewChild('header', { static: true }) headerTpl!: TemplateRef<any>;
  @ViewChild('footer', { static: true }) footerTpl!: TemplateRef<any>;
  @Output() close = new EventEmitter<void>();

  headerTxt = 'hello header';

  onClose() {
    this.close.emit();
  }
}

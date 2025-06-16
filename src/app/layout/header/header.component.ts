import { Component, EventEmitter, inject, input, output } from '@angular/core';
import { AuthStore } from '../../store/auth.store';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);

  clickMenu = output<boolean>();
  mode = input<'sidenav' | 'top'>();

  login() {
    this.authStore.login();
  }

  logout() {
    this.authStore.logout();
  }
}

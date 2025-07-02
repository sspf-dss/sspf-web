import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    Sidebar,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  authStore = inject(AuthStore);

  ngOnInit(): void {
    document.body.classList.add('azure-color');
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.darkMode.set(darkModeOn);

    if (darkModeOn) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }
  colorList = [{ name: 'rose' }, { name: 'azure' }, { name: 'violet' }];

  darkMode = signal<boolean>(false);
  darkModeIcon = computed(() => (this.darkMode() ? 'dark_mode' : 'light_mode'));

  sidebarCollapse = signal<boolean>(false);
  sidebarWidth = computed(() => (this.sidebarCollapse() ? '65px' : '250px'));

  changeColor(color: string) {
    const colorClass = this.colorList.map((c) => c.name + '-color');

    document.body.classList.remove(...colorClass);
    document.body.classList.add(`${color}-color`);
  }

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());

    const theme = this.darkMode() ? 'dark' : 'light';

    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);
  }

  logout() {
    this.authStore.logout();
  }
}

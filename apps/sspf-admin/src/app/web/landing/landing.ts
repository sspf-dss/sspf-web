import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../stores/auth.store';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  authStore = inject(AuthStore);

  login() {
    // console.log(window.location.origin + '/admin');
    this.authStore.login({ redirectUri: window.location.origin + '/admin' });
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  linkedSignal,
  ViewContainerRef,
} from '@angular/core';
import { AuthStore } from '../../store/auth.store';
import { MatButtonModule } from '@angular/material/button';
import { AddressDrawerComponent } from '../../components/address-drawer/address-drawer.component';
import { StrapiStore } from '../../store/strapi.store';
import { UpdateUserAttributeComponent } from '../../components/update-user-attribute/update-user-attribute.component';
import { MatIconModule } from '@angular/material/icon';
import { DrawerService } from '@sspf/ngx-drawer';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    UpdateUserAttributeComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  auth = inject(AuthStore);
  strapi = inject(StrapiStore);
  nameField = '';
  phoneField = '';

  drawer = inject(DrawerService);
  vcr = inject(ViewContainerRef);

  userLocal = linkedSignal(() => {
    return this.strapi.user()!;
  });

  nameFormOpen = false;
  phoneFormOpen = false;

  openForm(name: string) {
    if (name === 'name') this.nameFormOpen = !this.nameFormOpen;
    else if (name === 'phone') this.phoneFormOpen = !this.phoneFormOpen;
    else return;
  }

  openDrawer() {
    this.drawer.open(AddressDrawerComponent, this.vcr);
  }
}

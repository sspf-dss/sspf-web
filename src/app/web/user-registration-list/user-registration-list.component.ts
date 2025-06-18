import { CommonModule } from '@angular/common';
import { Component, computed, inject, resource } from '@angular/core';
import { StrapiStore } from '../../store/strapi.store';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-registration-list',
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule],
  templateUrl: './user-registration-list.component.html',
  styleUrl: './user-registration-list.component.scss',
})
export class UserRegistrationListComponent {
  readonly strapi = inject(StrapiStore);

  readonly registrationResource = resource({
    params: this.strapi.hasJwt,
    loader: async () => {
      return this.strapi
        .client()
        .collection('registrations')
        .find({
          filters: {
            user: {
              documentId: {
                $eq: this.strapi.user()!.documentId,
              },
            },
          },
          populate: ['course'],
        })
        .then((resp) => resp.data);
    },
  });

  readonly registrations = computed(() => {
    return this.registrationResource.value();
  });
}

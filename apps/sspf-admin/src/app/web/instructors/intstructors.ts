import { Component, computed, inject, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiStore } from '../../stores/strapi.store';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-intstructors',
  imports: [CommonModule, MatTableModule],
  templateUrl: './intstructors.html',
  styleUrl: './intstructors.scss',
})
export class Intstructors {
  strapi = inject(StrapiStore);
  readonly route = inject(Router);

  instructors = computed(() => this.instructorResource.value());

  instructorResource = resource({
    loader: async ({ abortSignal }) => {
      return this.strapi
        .client()
        .collection('instructors')
        .find()
        .then((resp) => resp.data);
    },
  });
}

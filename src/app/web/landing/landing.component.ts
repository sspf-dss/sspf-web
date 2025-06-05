import { CommonModule } from '@angular/common';
import { Component, inject, resource } from '@angular/core';
import { StrapiStore } from '../../store/strapi.store';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  readonly strapi = inject(StrapiStore);
  readonly route = inject(Router);
  courses = resource({
    loader: async ({ request, abortSignal }) => {
      return this.strapi
        .client()
        .collection('courses')
        .find()
        .then((resp) => resp.data);
    },
  });

  gotoCourse(documentId: string) {
    this.route.navigate(['/training/courses', documentId]);
  }
}

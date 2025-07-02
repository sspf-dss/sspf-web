import { Component, inject, OnInit, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiStore } from '../../stores/strapi.store';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  strapi = inject(StrapiStore);
  readonly route = inject(Router);

  coursesResource = resource({
    loader: async ({ abortSignal }) => {
      return this.strapi
        .client()
        .collection('courses')
        .find()
        .then((resp) => resp.data);
    },
  });
  goToRegistration(courseId: string) {
    this.route.navigate(['/admin/courses/registrations', courseId]);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, input, resource } from '@angular/core';
import { StrapiStore } from '../../store/strapi.store';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, MatButtonModule, MarkdownModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  readonly strapi = inject(StrapiStore);
  readonly documentId = input<string>();

  courseResource = resource({
    params: () => ({ documentId: this.documentId() }),
    loader: async ({ params, abortSignal }) => {
      return this.strapi
        .client()
        .collection('courses')
        .findOne(params.documentId!, {
          populate: ['course_info', 'instructors', 'topBanner'],
        });
    },
  });

  onError(event: any) {
    console.log(event);
  }
}

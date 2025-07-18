import {
  CommonModule,
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { Component, computed, inject, input, resource } from '@angular/core';
import { StrapiStore } from '../../../store/strapi.store';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';
import { Router } from '@angular/router';
import { sum } from 'lodash-es';
import { AuthStore } from '../../../store/auth.store';
import { Course, RegisterCount } from '@sspf/cms-types';

@Component({
  selector: 'app-courses',
  providers: [
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  imports: [CommonModule, MatButtonModule, MarkdownModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  readonly location = inject(Location);
  readonly strapi = inject(StrapiStore);
  readonly auth = inject(AuthStore);
  readonly documentId = input<string>();
  readonly route = inject(Router);

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

  course = computed(() => {
    return this.courseResource.value()?.data as Course;
  });

  isOpened = computed(() => {
    const now = new Date();
    if (this.course().endRegisterDate) {
      const endRegisterDate = new Date(this.course().endRegisterDate as Date);

      if (endRegisterDate > now) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });

  registrationResource = resource({
    params: () => ({ documentId: this.documentId() }),
    loader: async ({ params, abortSignal }) => {
      return this.strapi
        .client()
        .fetch(`courses/${params.documentId}/registeredCount`)
        .then((resp) => resp.json().then((json) => json as RegisterCount));
    },
  });

  registeredCount = computed(() => {
    const rc = this.registrationResource.value()!;
    return (
      (rc['ENROLLED'] ?? 0) +
      (rc['PAYMENT_PENDING'] ?? 0) +
      (rc['PAYMENT_RECEIVED'] ?? 0)
    );
  });

  isFulled = computed(() => {
    const registerCount = this.registrationResource.value()!;
    const allReg = sum(Object.values(registerCount)) ?? 0;
    const waitList = registerCount['WAIT_LIST'] ?? 0;
    const cancelled = registerCount['CANCELLED'] ?? 0;

    return allReg - waitList - cancelled >= this.course().participantNumber!;
  });

  registerForCourse(documentId: string) {
    if (this.auth.isAuthenticated()) {
      this.route.navigate(['/training/register-course', documentId]);
    } else {
      this.auth.login({
        redirectUri: `${window.location.protocol}//${
          window.location.host
        }${this.location.prepareExternalUrl(
          '/training/register-course',
        )}/${documentId}`,
      });
    }
  }
  onError(event: any) {
    console.log(event);
  }
}

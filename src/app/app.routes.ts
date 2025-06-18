import { Routes } from '@angular/router';
import { strapiResolver } from './strapi.resolver';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (mod) => mod.MainLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./web/home/home.component').then((mod) => mod.HomeComponent),
      },
      {
        path: 'aboutus',
        loadComponent: () =>
          import('./web/about-us/about-us.component').then(
            (mod) => mod.AboutUsComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./web/contact-us/contact-us.component').then(
            (mod) => mod.ContactUsComponent
          ),
      },
      {
        path: 'executives',
        loadComponent: () =>
          import(
            './web/executive-committees/executive-committees.component'
          ).then((mod) => mod.ExecutiveCommitteesComponent),
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./web/activities/activities.component').then(
            (mod) => mod.ActivitiesComponent
          ),
      },
      {
        path: 'training',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './web/training/training-landing/training-landing.component'
              ).then((mod) => mod.TrainingLandingComponent),
          },
          {
            path: 'courses/:documentId',
            loadComponent: () =>
              import('./web/training/courses/courses.component').then(
                (mod) => mod.CoursesComponent
              ),
          },
          {
            path: 'register-course/:documentId',
            loadComponent: () =>
              import(
                './web/training/register-course/register-course.component'
              ).then((mod) => mod.RegisterCourseComponent),
            canActivate: [isAuthenticatedGuard],
            resolve: [strapiResolver],
          },
          {
            path: 'user/registrations',
            loadComponent: () =>
              import(
                './web/user-registration-list/user-registration-list.component'
              ).then((mod) => mod.UserRegistrationListComponent),
            canActivate: [isAuthenticatedGuard],
            resolve: [strapiResolver],
          },
          {
            path: 'user/profile',
            loadComponent: () =>
              import('./web/user-profile/user-profile.component').then(
                (mod) => mod.UserProfileComponent
              ),
            canActivate: [isAuthenticatedGuard],
            resolve: [strapiResolver],
          },
        ],
      },
    ],
  },
];

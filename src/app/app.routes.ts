import { Routes } from '@angular/router';
import { LandingComponent } from './web/landing/landing.component';
import { CoursesComponent } from './web/courses/courses.component';
import { RegisterCourseComponent } from './web/register-course/register-course.component';
import { TestDrawerComponent } from './web/test-drawer/test-drawer.component';
import { strapiResolver } from './strapi.resolver';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

export const routes: Routes = [
  {
    path: 'training',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (mod) => mod.MainLayoutComponent,
      ),
    children: [
      { path: '', component: LandingComponent },
      { path: 'courses/:documentId', component: CoursesComponent },
      {
        path: 'register-course/:documentId',
        component: RegisterCourseComponent,
        canActivate: [isAuthenticatedGuard],
        resolve: [strapiResolver],
      },
      { path: 'test-drawer', component: TestDrawerComponent },
    ],
  },
];

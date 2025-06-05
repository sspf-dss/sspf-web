import { Routes } from '@angular/router';
import { LandingComponent } from './web/landing/landing.component';
import { CoursesComponent } from './web/courses/courses.component';

export const routes: Routes = [
  {
    path: 'training',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(
        (mod) => mod.MainLayoutComponent
      ),
    children: [
      { path: '', component: LandingComponent },
      { path: 'courses/:documentId', component: CoursesComponent },
    ],
  },
];

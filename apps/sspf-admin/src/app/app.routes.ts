import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    title: 'ระบบจัดการ มูลนิธิส่งเสริมวิทยาศาสตร์บริการ',
    loadComponent: () =>
      import('./web/landing/landing').then((mod) => mod.Landing),
  },
  {
    path: 'admin',
    title: 'ระบบจัดการ มูลนิธิส่งเสริมวิทยาศาสตร์บริการ',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then((mod) => mod.MainLayout),
    children: [
      {
        path: 'courses',

        children: [
          {
            path: '',
            loadComponent: () =>
              import('./web/courses/courses').then((mod) => mod.Courses),
          },
          {
            path: 'registrations/:courseId',
            loadComponent: () =>
              import('./web/courses-register/courses-register').then(
                (mod) => mod.CoursesRegister
              ),
          },
        ],
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./web/main-page').then((mod) => mod.MainPage),
      },
    ],
  },
];

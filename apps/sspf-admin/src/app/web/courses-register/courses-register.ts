import {
  Component,
  computed,
  inject,
  input,
  resource,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrapiStore } from '../../stores/strapi.store';
import { Course, Meta, Registration } from '@sspf/cms-types';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { AddressLine } from '../../components/address-line';

@Component({
  selector: 'app-courses-register',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    AddressLine,
  ],
  templateUrl: './courses-register.html',
  styleUrl: './courses-register.scss',
})
export class CoursesRegister {
  strapi = inject(StrapiStore);
  courseId = input<string>();
  dialog = inject(MatDialog);

  course = computed(() => this.courseResource.value()?.data as Course);

  registrationsCurrentPage = signal<number>(0);
  registrationsCurrentPageSize = signal<number>(25);

  courseResource = resource({
    params: () => ({ courseId: this.courseId() }),
    loader: async ({ params, abortSignal }) => {
      return this.strapi
        .client()
        .collection('courses')
        .findOne(this.courseId()!);
    },
  });

  registrations = computed(
    () => this.registrationsResource.value()?.data as Registration[]
  );

  registrationsPage = computed(() => {
    const meta = this.registrationsResource.value()?.meta as Meta;
    return meta.pagination;
  });

  registrationsResource = resource({
    params: () => ({
      courseId: this.courseId(),
      page: this.registrationsCurrentPage(),
    }),
    loader: async ({ params, abortSignal }) => {
      return this.strapi
        .client()
        .collection('registrations')
        .find({
          filters: {
            course: { documentId: { $eq: this.courseId() } },
          },
          populate: [
            'uploads',
            'certificateAddress',
            'certificateAddress.province',
            'certificateAddress.subdistrict',
            'certificateAddress.district',
            'receiptAddress',
            'receiptAddress.province',
            'receiptAddress.subdistrict',
            'receiptAddress.district',
          ],
          pagination: {
            page: this.registrationsCurrentPage(),
            pageSize: 25,
          },
          sort: ['registerDate:asc'],
        });
    },
  });

  handlePageEvent(page: PageEvent) {
    this.registrationsCurrentPage.set(page.pageIndex + 1);
  }

  openUpload(url: string, type: 'image' | 'pdf' | 'unsupport') {
    this.dialog.open(PreviewDialogComponent, {
      data: { url: url, type: type },
      width: '80%',
      height: '80%',
    });
  }
  fileType(type: string): 'image' | 'pdf' | 'unsupport' {
    if (type === 'application/pdf') {
      return 'pdf';
    } else if (type.startsWith('image/')) {
      return 'image';
    } else {
      return 'unsupport';
    }
  }
}

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  template:
    '<img *ngIf="data.type === \'image\'" alt="" [src]="url" class="object-scale-down object-center"/><ngx-extended-pdf-viewer *ngIf="data.type === \'pdf\'" [src]="url" type="application/pdf" style="max-width:100%"></ngx-extended-pdf-viewer>',
  imports: [CommonModule, MatDialogModule, NgxExtendedPdfViewerModule],
})
export class PreviewDialogComponent {
  strapi = inject(StrapiStore);
  data: { url: string; type: 'image' | 'pdf' | 'unsupport' } =
    inject(MAT_DIALOG_DATA);

  url = this.strapi.url(this.data.url);
}

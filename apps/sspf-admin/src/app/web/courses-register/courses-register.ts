import {
  Component,
  computed,
  inject,
  input,
  OnInit,
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { AddressLine } from '../../components/address-line';

type FileInfo = {
  file: File;
  name: string;
  preview: string;
  type: string;
};

@Component({
  selector: 'app-courses-register',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    AddressLine,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './courses-register.html',
  styleUrl: './courses-register.scss',
})
export class CoursesRegister {
  strapi = inject(StrapiStore);
  courseId = input<string>();
  dialog = inject(MatDialog);
  sb = inject(MatSnackBar);

  course = computed(() => this.courseResource.value()?.data as Course);

  isStartUploading: [boolean] | [] = [];

  registrationsCurrentPage = signal<number>(0);
  registrationsCurrentPageSize = signal<number>(25);

  receiptFiles: (FileInfo | undefined)[] = [];

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
    () => this.registrationsResource.value()?.data as Registration[],
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
            'receipt',
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

  openPreview(index: number) {
    const item = this.receiptFiles[index];

    if (item?.file) {
      this.dialog.open(PreviewDialogComponent, {
        data: { preview: item?.preview, type: item.type },
        width: '80%',
        height: '80%',
      });
    }
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
  selectFiles(event: any, index: number): void {
    if (event.target.files) {
      const file: File | null = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log('onload!');
          this.receiptFiles[index] = {
            file: file,
            preview: e.target.result,
            type: this.fileType(file.type),
            name: file.name,
          };
          console.log(this.receiptFiles[index]);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  cancelUpload(index: number) {
    this.receiptFiles[index] = undefined;
    this.isStartUploading[index] = false;
  }

  async startUpload(index: number, registrationId: string) {
    this.isStartUploading[index] = true;

    const formData = new FormData();
    if (this.receiptFiles[index]) {
      formData.append(
        'files',
        this.receiptFiles[index]?.file,
        this.receiptFiles[index].file.name,
      );

      const uploadResp = await this.strapi
        .client()
        .fetch(`/registration/${registrationId}/uploadReceipt`, {
          method: 'POST',
          body: formData,
        })
        .then((resp) => resp.json());

      this.registrationsResource.reload();

      this.sb.open('Upload Receipt Success', 'OK', { duration: 8000 });
      this.isStartUploading[index] = false;
    }
  }
}

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  template:
    '<img *ngIf="data.type === \'image\'" alt="" [src]="src" class="object-scale-down object-center"/><ngx-extended-pdf-viewer *ngIf="data.type === \'pdf\'" [src]="this.src" type="application/pdf" style="max-width:100%"></ngx-extended-pdf-viewer>',
  imports: [CommonModule, MatDialogModule, NgxExtendedPdfViewerModule],
})
export class PreviewDialogComponent implements OnInit {
  strapi = inject(StrapiStore);
  data: { url: string; type: 'image' | 'pdf' | 'unsupport'; preview: string } =
    inject(MAT_DIALOG_DATA);
  src = '';

  ngOnInit(): void {
    if (this.data.preview) {
      this.src = this.data.preview;
    } else if (this.data.url) {
      this.src = this.strapi.url(this.data.url);
    }
  }
}

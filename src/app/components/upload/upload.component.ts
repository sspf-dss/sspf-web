import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  inject,
  output,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Observable } from 'rxjs';

type FileInfo = {
  file: File;
  preview: string;
};

@Component({
  selector: 'app-upload',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent {
  selectedFiles?: FileList;
  currentFile?: File;
  files: FileInfo[] = [];
  progress: number = 0;
  message: string = '';

  preview: string = '';
  imagesInfos?: Observable<any>;

  @Output() fileUploadEvent = new EventEmitter<File>();
  @Output() fileIndexRemoveEvent = new EventEmitter<number>();

  done = output<File[]>();

  dialog = inject(MatDialog);

  removeFile($index: number) {
    this.files.splice($index, 1);
    this.fileIndexRemoveEvent.emit($index);
  }

  upload() {
    this.done.emit(this.files.map((f) => f.file));
  }

  selectFiles(event: any): void {
    this.message = '';
    this.progress = 0;
    this.preview = '';

    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;

          this.files.push({ file: file, preview: this.preview });

          this.fileUploadEvent.emit(this.currentFile);
        };

        reader.readAsDataURL(file);
      }
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

  openPreview(index: number) {
    const item = this.files[index];
    let fileType = this.fileType(item?.file!.type!);

    this.dialog.open(PreviewDialogComponent, {
      data: { preview: item?.preview, type: fileType },
      width: '80%',
      height: '80%',
    });
  }
}

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  template:
    '<img *ngIf="data.type === \'image\'" [src]="data.preview" class="object-scale-down object-center"/><ngx-extended-pdf-viewer *ngIf="data.type === \'pdf\'" [src]="data.preview" type="application/pdf" style="max-width:100%"></ngx-extended-pdf-viewer>',
  imports: [CommonModule, MatDialogModule, NgxExtendedPdfViewerModule],
})
export class PreviewDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { preview: string; type: 'image' | 'pdf' },
  ) {}
}

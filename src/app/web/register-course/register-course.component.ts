import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  OnInit,
  resource,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { StrapiStore } from '../../store/strapi.store';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DrawerService } from 'ngx-drawer';
import { AddressDrawerComponent } from '../../components/address-drawer/address-drawer.component';
import { Address } from '../../lib/openapi/sspf-cms-type';
import { AddressCardComponent } from '../../components/address-card/address-card.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadComponent } from '../../components/upload/upload.component';

@Component({
  selector: 'app-register-course',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AddressCardComponent,
    ReactiveFormsModule,
    UploadComponent,
  ],
  templateUrl: './register-course.component.html',
  styleUrl: './register-course.component.scss',
})
export class RegisterCourseComponent implements OnInit {
  ngOnInit(): void {
    this.strapi.isReady$.subscribe((ready) => {
      if (ready && !this.hasRegister()) {
        this.registrationForm.patchValue({
          email: this.strapi.user().email,
        });
      }
    });
  }

  constructor() {
    effect(() => {
      if (this.registrationResource.status() === 'error') {
        this.sb.open(
          `Failed to get registrations: ${this.registrationResource.error()?.name!}`,
          'OK',
          {
            duration: 8000,
          },
        );
      }

      if (this.courseResource.status() === 'error') {
        this.sb.open(
          `Failed to get course: ${this.courseResource.error()?.name!}`,
          'OK',
          {
            duration: 8000,
          },
        );
      }

      if (this.hasRegister()) {
        const reg = this.registrationResource.value()![0]!;
        this.registrationForm.patchValue({
          nameOnCertificate: reg['nameOnCertificate'],
          email: reg['email'],
          phone: reg['phone'],
          receiptAddress: reg['receiptAddress']['documentId'],
          certificateAddress: reg['certificateAddress']['documentId'],
        });
        this.receiptAddress.set(reg['receiptAddress']);
        this.certificateAddress.set(reg['certificateAddress']);

        this.registrationForm.disable();
      }
    });
  }

  readonly strapi = inject(StrapiStore);
  readonly drawer = inject(DrawerService);
  readonly vcr = inject(ViewContainerRef);
  readonly fb = inject(FormBuilder);
  readonly sb = inject(MatSnackBar);

  readonly documentId = input<string>();

  registrationForm = this.fb.group({
    nameOnCertificate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    receiptAddress: ['', Validators.required],
    certificateAddress: ['', Validators.required],
  });

  hasRegister = computed(() => {
    return (
      this.registrationResource.hasValue() &&
      this.registrationResource.value().length > 0
    );
  });

  hasPaymentReceived = computed(() => {
    return (
      this.hasRegister() &&
      this.registrationResource.value()![0]!['registerStatus'] ===
        'PAYMENT_RECEIVED'
    );
  });

  receiptAddress = linkedSignal(() => {
    if (this.hasRegister()) {
      return this.registrationResource.value()![0]!['receiptAddress'];
    } else {
      return undefined;
    }
  });

  certificateAddress = linkedSignal(() => {
    if (this.hasRegister()) {
      return this.registrationResource.value()![0]!['certificateAddress'];
    } else {
      return undefined;
    }
  });

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

  registrationResource = resource({
    params: this.strapi.hasJwt,
    loader: async ({ params, abortSignal }) => {
      return this.strapi
        .client()
        .collection('registrations')
        .find({
          filters: {
            user: {
              documentId: {
                $eq: this.strapi.user().documentId,
              },
            },
            course: {
              documentId: {
                $eq: this.documentId(),
              },
            },
          },
          populate: [
            'receiptAddress',
            'receiptAddress.province',
            'receiptAddress.district',
            'receiptAddress.subdistrict',
            'certificateAddress',
            'certificateAddress.province',
            'certificateAddress.district',
            'certificateAddress.subdistrict',
            'uploads',
          ],
        })
        .then((resp) => resp.data);
    },
  });

  async register() {
    this.registrationForm.markAllAsTouched();
    if (!this.registrationForm.valid) {
      this.sb.open('กรุณาใส่ข้อมูลลงทะเบียนให้ครบถ้วน', 'OK', {
        duration: 3000,
      });
      return;
    }

    const courses = this.strapi.client().collection('registrations');
    const now = new Date();

    const resp = await courses
      .create({
        registerDate: now,
        nameOnCertificate: this.registrationForm.value.nameOnCertificate,
        email: this.registrationForm.value.email,
        phone: this.registrationForm.value.phone,
        receiptAddress: [this.registrationForm.value.receiptAddress],
        certificateAddress: [this.registrationForm.value.certificateAddress],
        user: [this.strapi.user().documentId],
        course: [this.courseResource.value()?.data.documentId],
      })
      .then((resp) => {
        this.sb.open('ลงทะเบียนสำเร็จ', 'OK', { duration: 8000 });
        return resp.data;
      })
      .catch((err) => {
        this.sb.open(err, 'OK', { duration: 8000 });
      });

    this.registrationResource.reload();
  }

  async startUpload(files: File[]) {
    const formData = new FormData();
    const registrationDocuemntId =
      this.registrationResource.value()![0]!.documentId;
    files.forEach((file) => formData.append('files', file, file.name));
    formData.append('ref', 'api::registration.registration');
    formData.append('refId', this.registrationResource.value()![0]!['id']);
    formData.append('field', 'upload');

    const uploadResp = await this.strapi
      .client()
      .fetch('/upload', {
        method: 'POST',
        body: formData,
      })
      .then((resp) => resp.json());

    console.log(uploadResp);
    const data = {
      data: {
        uploads: { connect: [uploadResp[0].id] },
      },
    };

    const linkResp = await this.strapi
      .client()
      .fetch(`/registrations/${registrationDocuemntId}/uploads-connect`, {
        body: JSON.stringify(data),
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((resp) => resp.json());

    // now we can reload
    this.registrationResource.reload();
  }

  openDrawer(where: 'receipt' | 'certificate') {
    this.drawer.open(AddressDrawerComponent, this.vcr, {
      inputs: {
        inputAddress:
          where === 'receipt'
            ? this.receiptAddress()
            : this.certificateAddress(),
      },
      onOutput: (instance) => {
        instance.selectedAddress.subscribe((address) => {
          if (where === 'receipt') {
            this.receiptAddress.set(address);
            this.registrationForm.patchValue({
              receiptAddress: address.documentId,
            });
          } else {
            this.certificateAddress.set(address);
            this.registrationForm.patchValue({
              certificateAddress: address.documentId,
            });
          }
        });
      },
    });
  }
}

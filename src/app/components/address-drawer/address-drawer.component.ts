import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  linkedSignal,
  OnInit,
  output,
  Output,
  resource,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DrawerService, HasDrawerTemplates } from 'ngx-drawer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { LocationService } from '../../services/location.service';
import { Address } from '../../lib/types/sspf-cms-type';
import { StrapiStore } from '../../store/strapi.store';
import { AddressCardComponent } from '../address-card/address-card.component';
import { add } from 'lodash';

@Component({
  selector: 'app-address-drawer',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatRadioModule,
    MatIcon,
    MatSnackBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    AddressCardComponent,
  ],
  templateUrl: './address-drawer.component.html',
  styleUrl: './address-drawer.component.scss',
})
export class AddressDrawerComponent implements HasDrawerTemplates, OnInit {
  constructor(
    private readonly drawer: DrawerService,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly locationService: LocationService
  ) {
    this.addressForm = this.fb.group({
      id: [''],
      companyName: [''],
      contactName: ['', Validators.required],
      phone: ['', Validators.required],
      taxId: [
        '',
        [
          Validators.minLength(13),
          Validators.maxLength(13),
          Validators.pattern(/^\d+$/),
        ],
      ],
      line1: ['', Validators.required],
      line2: [''],
      province: ['', Validators.required],
      district: ['', Validators.required],
      subdistrict: ['', Validators.required],
      zip: ['', Validators.required],
    });
  }
  @ViewChild('header', { static: true }) headerTpl!: TemplateRef<any>;
  @ViewChild('footer', { static: true }) footerTpl!: TemplateRef<any>;
  @Output() close = new EventEmitter<void>();

  selectedAddress = output<Address>();

  @Input() inputAddress: Address | undefined;

  readonly strapi = inject(StrapiStore);

  header = input<string>('กรุณาเลือกที่อยู่');

  addressForm: FormGroup;
  addresses: Address[] = [];
  editPanelOpen: boolean = false;

  selectedAddressId: string | null = null;
  editingAddress: Address | null = null;

  // provinces: any[] = [];
  provinceResource = resource({
    loader: () => this.locationService.getProvinces(),
  });
  provinceSelected = signal<string>('');

  districtResource = resource({
    params: this.provinceSelected,
    loader: ({ params }) => this.locationService.getDistricts(params),
  });
  districtSelected = signal<string>('');

  subdistrictResource = resource({
    params: this.districtSelected,
    loader: ({ params }) => this.locationService.getSubdistricts(params),
  });

  addressResource = resource({
    loader: () => {
      return this.strapi
        .client()
        .collection('addresses')
        .find({
          filters: { user: { documentId: this.strapi.user()!.documentId } },
          populate: ['province', 'district', 'subdistrict'],
        })
        .then((resp) => resp.data as Address[]);
    },
  });

  districts: any[] = [];
  subdistricts: any[] = [];
  isLoading = linkedSignal(() => {
    return (
      this.provinceResource.isLoading() ||
      this.districtResource.isLoading() ||
      this.subdistrictResource.isLoading()
    );
  });

  headerTxt = linkedSignal<string>(() => this.header());

  onClose() {
    this.close.emit();
  }

  ngOnInit() {
    this.loadProvinces();
    if (this.inputAddress) {
      this.selectedAddressId = this.inputAddress.documentId!;
    }
  }

  // loadAddress() {
  //   this.addressResource.reload();
  // }

  loadProvinces() {
    this.provinceResource.reload();
  }

  onProvinceChange(provinceId: string) {
    this.addressForm.patchValue({
      province: provinceId,
      district: '',
      subdistrict: '',
    });
    this.provinceSelected.set(provinceId);
  }

  onDistrictChange(districtId: string) {
    this.addressForm.patchValue({ district: districtId, subdistrict: '' });
    this.districtSelected.set(districtId);
  }

  onSubdistrictChange(subdistrictId: string) {
    this.addressForm.patchValue({ subdistrict: subdistrictId });
  }

  onAddressRadioChange(addressId: string) {
    const address = this.addressResource
      .value()
      ?.find((addr) => addr.documentId === addressId);
    if (address != undefined) {
      this.selectedAddress.emit(address);
    }
  }

  startCreate() {
    this.editPanelOpen = true;
    this.editingAddress = {} as Address;
    this.addressForm.reset();
    this.headerTxt.set('เพิ่มที่อยู่ใหม่');
  }

  startEdit(addr: Address) {
    this.editPanelOpen = true;
    this.editingAddress = addr;
    this.addressForm.patchValue(addr);
    this.onProvinceChange(addr.province?.documentId!);
    this.onDistrictChange(addr.district?.documentId!);
    this.onSubdistrictChange(addr.subdistrict?.documentId!);
    this.headerTxt.set('แก้ไขที่อยู่');
  }

  cancelEdit() {
    this.editPanelOpen = false;
    this.editingAddress = null;
    this.addressForm.reset();
    this.headerTxt.set('กรุณาเลือกที่อยู่');
  }

  saveAddress() {
    if (!this.addressForm.valid) {
      this.snackBar.open('Please fill out all required fields.', 'OK', {
        duration: 3000,
      });
      return;
    }

    this.isLoading.set(true);

    const formValue = this.addressForm.value;
    const isNew = !formValue.id;
    const address: Address = {
      ...formValue,
      id: isNew ? undefined : undefined,
      province: [formValue.province],
      district: [formValue.district],
      subdistrict: [formValue.subdistrict],
      user: [this.strapi.user()!.documentId!],
    };

    if (isNew) {
      this.strapi
        .client()
        .collection('addresses')
        .create(address)
        .then(() => {
          this.addressResource.reload();
        });
      this.snackBar.open('Address added', 'OK', { duration: 2000 });
    } else {
      this.strapi
        .client()
        .collection('addresses')
        .update(this.editingAddress!.documentId!, address)
        .then(() => {
          this.addressResource.reload();
        });
      this.snackBar.open('Address updated', 'OK', { duration: 2000 });
    }

    this.isLoading.set(false);
    this.editingAddress = null;
    this.addressForm.reset();
    this.selectedAddressId = address.documentId!;
    this.editPanelOpen = false;
    this.headerTxt.set('กรุณาเลือกที่อยุ่');
  }

  deleteAddress(id: string) {
    this.addresses = this.addresses.filter((a) => a.documentId !== id);
    if (this.selectedAddressId === id) this.selectedAddressId = null;
    this.snackBar.open('Address deleted', 'OK', { duration: 2000 });
  }
}

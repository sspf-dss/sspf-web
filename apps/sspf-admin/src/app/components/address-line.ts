import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address } from '@sspf/cms-types';

@Component({
  selector: 'app-address-line',
  imports: [CommonModule],
  templateUrl: './address-line.html',
  styleUrl: './address-line.scss',
})
export class AddressLine {
  addr = input.required<Address>();
  label = input<string>();

  isBangkok = computed(() => this.addr().province?.nameTh === 'กรุงเทพมหานคร');

  subDistrictTxt = computed(
    () =>
      `${this.isBangkok() ? 'แขวง' : 'ต.'}${this.addr().subdistrict?.nameTh}`,
  );

  districtTxt = computed(
    () => `${this.isBangkok() ? 'เขต' : 'อ.'}${this.addr().district?.nameTh}`,
  );
  provinceTxt = computed(
    () => `${this.isBangkok() ? '' : 'จ.'}${this.addr().province?.nameTh}`,
  );
}

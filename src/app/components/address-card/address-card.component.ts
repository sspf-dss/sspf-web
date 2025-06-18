import { Component, computed, input } from '@angular/core';
import { Address } from '../../lib/openapi/sspf-cms-type';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-address-card',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './address-card.component.html',
  styleUrl: './address-card.component.scss',
})
export class AddressCardComponent {
  address = input.required<Address>();
  isBangkok = computed(() => {
    return this.address().province?.nameEn === 'Bangkok';
  });
}

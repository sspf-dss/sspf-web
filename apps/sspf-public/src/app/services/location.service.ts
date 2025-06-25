import { inject, Injectable } from '@angular/core';
import { StrapiStore } from '../store/strapi.store';
import { District, Province, Subdistrict } from '@sspf/cms-types';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  strapi = inject(StrapiStore);

  async getProvinces(): Promise<Province[]> {
    const resp = await this.strapi
      .client()
      .collection('provinces')
      .find({ pagination: { limit: 100 } });
    return resp.data as Province[];
  }

  async getDistricts(provinceId: string): Promise<District[]> {
    const resp = await this.strapi
      .client()
      .collection('districts')
      .find({
        filters: { province: { documentId: provinceId } },
        pagination: { limit: 100 },
      });
    return resp.data as District[];
  }

  async getSubdistricts(districtId: string): Promise<Subdistrict[]> {
    const resp = await this.strapi
      .client()
      .collection('subdistricts')
      .find({
        filters: { district: { documentId: districtId } },
        pagination: { limit: 100 },
      });
    return resp.data as Subdistrict[];
  }
}

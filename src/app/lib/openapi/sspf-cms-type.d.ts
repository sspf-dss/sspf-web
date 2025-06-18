export type Province = {
  id?: number;
  documentId?: string;
  nameTh?: string;
  nameEn?: string;
  districts?: District[];
};

export type District = {
  id?: number;
  documentId?: string;
  nameTh?: string;
  nameEn?: string;
  province?: Province;
  subdistricts?: Subdistrict[];
};

export type Subdistrict = {
  id?: number;
  documentId?: string;
  nameTh?: string;
  nameEn?: string;
  district?: District;
};

export type Address = {
  id?: number;
  documentId?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  taxId?: string;
  line1?: string;
  line2?: string;
  zip?: string;
  province?: Province;
  district?: District;
  subdistrict?: Subdistrict;
};

export type StrapiAuth = {
  jwt?: string;
  user?: User;
};


export type User = {
  id?: number;
  documentId?: string;
  email?: string;
  userName?: string;
  provider?: string;
  comfirm?: boolean;
  blocked?: boolean;
  adderesses?: Address[];
  name?: string;
  phone?: string;
  jwt?: string;
}

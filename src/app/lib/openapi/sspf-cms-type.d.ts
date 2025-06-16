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

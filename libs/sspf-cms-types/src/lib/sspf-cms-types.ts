import { API } from '@strapi/client';

export type Meta = API.ResponseMeta;

export type Province = API.Document & {
  id?: number;
  documentId?: string;
  nameTh?: string;
  nameEn?: string;
  districts?: District[];
};

export type District = API.Document & {
  id?: number;
  documentId?: string;
  nameTh?: string;
  nameEn?: string;
  province?: Province;
  subdistricts?: Subdistrict[];
};

export type Subdistrict = API.Document & {
  id?: number;
  documentId?: string;
  nameTh?: string;
  nameEn?: string;
  district?: District;
};

export type Address = API.Document & {
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

export type Registration = API.Document & {
  course?: Course;
  user?: User;
  nameOnCertificate?: string;
  phone?: string;
  email?: string;
  registerDate?: Date;
  registerStatus?: RegisterStatus;
  receiptAddress?: Address;
  certificateAddress?: Address;
  remark?: string;
};

export type Course = API.Document & {
  name?: string;
  stratDate?: Date;
  endDate?: Date;
  fee?: number;
  isFull?: boolean;
  openRegisterDate?: Date;
  endRegisterDate?: Date;
  participantNumber?: number;
  isOpend?: boolean;
  instructor?: Instructor;
  registrations?: Registration[];
  course_info?: CourseInfo;
  isOnline?: boolean;
  venue?: string;
};

export type Instructor = API.Document & {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  bankAccount?: string;
  remark?: string;
  displayName?: string;
};

export type CourseInfo = API.Document & {
  course?: Course;
  descriptionMD?: string;
  objectiveMD?: string;
  requirementMD?: string;
  outlineMD?: string;
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
};

export type RegisterStatus =
  | 'REGISTERED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_RECEIVED'
  | 'ENROLLED'
  | 'WAIT_LIST'
  | 'CANCELLED';

export type RegisterCount = {
  [key in RegisterStatus]: number | undefined;
};

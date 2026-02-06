import type { AdmissionFormDataWithEmptyEnums } from './admission-schema';

export const STEPS = [
  { id: 1, title: 'Personal', icon: '1', subtitle: 'Student details' },
  { id: 2, title: 'Guardian', icon: '2', subtitle: 'Parent info' },
  { id: 3, title: 'Academic', icon: '3', subtitle: 'Course & education' },
  { id: 4, title: 'Documents', icon: '4', subtitle: 'Attach files' },
] as const;

export const OCCUPATIONS = [
  'Teacher',
  'Trader',
  'Government Employee',
  'Imam/Khatib',
  'Doctor',
  'Engineer',
  'Driver',
  'Laborer',
  'Farmer',
  'Business Owner',
  'Other',
];

export const COUNTRIES = [
  'Pakistan',
  'Bangladesh',
  'Afghanistan',
  'Saudi Arabia',
  'UAE',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Other',
];

export const INITIAL_FORM_DATA: AdmissionFormDataWithEmptyEnums = {
  name: '',
  fatherName: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  email: '',
  idNumber: '',
  address: '',
  permanentAddress: '',
  country: '',
  state: '',
  city: '',
  area: '',
  language: '',
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  guardianEmail: '',
  guardianOccupation: '',
  guardianAddress: '',
  requiredClassId: '',
  previousSchool: '',
  previousClass: '',
  previousGrade: '',
  isHafiz: '',
  accommodationType: '',
  photoFile: '',
  idFile: '',
  authorityLetterFile: '',
  previousResultFile: '',
};

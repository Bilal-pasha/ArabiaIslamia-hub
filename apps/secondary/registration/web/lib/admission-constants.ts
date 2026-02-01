import type { AdmissionFormData } from './admission-schema';

export const STEPS = [
  { id: 1, title: 'Personal', icon: '1', subtitle: 'Student details' },
  { id: 2, title: 'Guardian', icon: '2', subtitle: 'Parent info' },
  { id: 3, title: 'Academic', icon: '3', subtitle: 'Course & education' },
  { id: 4, title: 'Documents', icon: '4', subtitle: 'Attach files' },
] as const;

export const DEPARTMENTS = [
  'Arabic Dars-e-Nizami',
  'Secondary Education System',
  'Darul Quran',
  'Huffaz Courses',
  'Primary',
];

export const CLASSES = [
  'Primary Level',
  'Level One',
  'Level Two',
  'Level Three',
  'Level Four',
  'Level Five',
  'Level Six',
  'Quran Memorization',
  'Quran Recitation (Nazira)',
  'Quran Memorization Review',
  'Tajweed Quran',
  'Foundation Level',
  'Grade 9',
  'Grade 10',
  'Matriculation',
];

export const MADHABS = ['Hanafi', "Shafi'i", 'Maliki', 'Hanbali'];

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
  'India',
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

export const INITIAL_FORM_DATA: AdmissionFormData = {
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
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  guardianEmail: '',
  guardianOccupation: '',
  guardianAddress: '',
  department: '',
  requiredClass: '',
  previousSchool: '',
  previousClass: '',
  previousGrade: '',
  isHafiz: '',
  accommodationType: '',
  madhab: '',
  photoFile: '',
  idFile: '',
  authorityLetterFile: '',
  previousResultFile: '',
};

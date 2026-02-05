import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  createDataSourceOptions,
  User,
  Class,
  Section,
  AcademicSession,
  Subject,
  Student,
  Teacher,
  Parent,
  Registration,
  Attendance,
  FeeType,
  FeeStructure,
  FeePayment,
  AdmissionApplication,
  RenewalApplication,
} from '@arabiaaislamia/database';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  const options = createDataSourceOptions('secondary');
  return {
    ...options,
    entities: [
      User,
      Class,
      Section,
      AcademicSession,
      Subject,
      Student,
      Teacher,
      Parent,
      Registration,
      Attendance,
      FeeType,
      FeeStructure,
      FeePayment,
      AdmissionApplication,
      RenewalApplication,
    ],
    migrations: [],
    synchronize: process.env.NODE_ENV !== 'production',
  };
}

export { User } from './entities/user.entity';
export { Class } from './entities/class.entity';
export { Section } from './entities/section.entity';
export { AcademicSession } from './entities/academic-session.entity';
export { Subject } from './entities/subject.entity';
export { Student } from './entities/student.entity';
export { Teacher } from './entities/teacher.entity';
export { Parent } from './entities/parent.entity';
export { Registration } from './entities/registration.entity';
export { Attendance, type AttendanceStatus } from './entities/attendance.entity';
export { AdmissionApplication } from './entities/admission-application.entity';
export { FeeType } from './entities/fee-type.entity';
export { FeeStructure } from './entities/fee-structure.entity';
export { FeePayment, type FeePaymentStatus } from './entities/fee-payment.entity';
export { ScoutsUser } from './entities/scouts-user.entity';
export { Madrasa } from './entities/madrasa.entity';
export { ScoutsStudent } from './entities/scouts-student.entity';
export {
  createDataSource,
  createDataSourceOptions,
  getDatabaseName,
  type DatabaseConfigParams,
  type ProjectId,
} from './config';

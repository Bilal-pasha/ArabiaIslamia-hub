import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Registration } from './registration.entity';
import { FeeStructure } from './fee-structure.entity';
import { FeePayment } from './fee-payment.entity';
import { Attendance } from './attendance.entity';

@Entity('academic_sessions')
export class AcademicSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'boolean', default: false, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Registration, (reg) => reg.academicSession)
  registrations: Registration[];

  @OneToMany(() => FeeStructure, (fs) => fs.academicSession)
  feeStructures: FeeStructure[];

  @OneToMany(() => FeePayment, (fp) => fp.academicSession)
  feePayments: FeePayment[];

  @OneToMany(() => Attendance, (a) => a.academicSession)
  attendances: Attendance[];
}

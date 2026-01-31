import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { FeeType } from './fee-type.entity';
import { AcademicSession } from './academic-session.entity';

export type FeePaymentStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

@Entity('fee_payments')
export class FeePayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Student, (s) => s.feePayments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid', name: 'fee_type_id' })
  feeTypeId: string;

  @ManyToOne(() => FeeType, (ft) => ft.feePayments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fee_type_id' })
  feeType: FeeType;

  @Column({ type: 'uuid', name: 'academic_session_id' })
  academicSessionId: string;

  @ManyToOne(() => AcademicSession, (as) => as.feePayments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_session_id' })
  academicSession: AcademicSession;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'date', name: 'paid_at' })
  paidAt: Date;

  @Column({ type: 'varchar', length: 20, default: 'paid' })
  status: FeePaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

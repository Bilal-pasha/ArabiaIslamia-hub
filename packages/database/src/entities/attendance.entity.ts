import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Registration } from './registration.entity';
import { AcademicSession } from './academic-session.entity';

export type AttendanceStatus = 'present' | 'absent' | 'late';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'registration_id' })
  registrationId: string;

  @ManyToOne(() => Registration, (r) => r.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'registration_id' })
  registration: Registration;

  @Column({ type: 'uuid', name: 'academic_session_id' })
  academicSessionId: string;

  @ManyToOne(() => AcademicSession, (as) => as.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_session_id' })
  academicSession: AcademicSession;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 20 })
  status: AttendanceStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remarks: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

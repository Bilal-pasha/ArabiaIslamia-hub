import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';
import { AcademicSession } from './academic-session.entity';
import { Class } from './class.entity';
import { Section } from './section.entity';

@Entity('renewal_applications')
export class RenewalApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid', name: 'academic_session_id' })
  academicSessionId: string;

  @ManyToOne(() => AcademicSession, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'academic_session_id' })
  academicSession: AcademicSession;

  @Column({ type: 'uuid', name: 'class_id' })
  classId: string;

  @ManyToOne(() => Class, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'uuid', name: 'section_id' })
  sectionId: string;

  @ManyToOne(() => Section, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column({ type: 'varchar', length: 30, name: 'contact_override', nullable: true })
  contactOverride: string | null;

  @Column({ type: 'varchar', length: 500, name: 'address_override', nullable: true })
  addressOverride: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 500, name: 'status_reason', nullable: true })
  statusReason: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

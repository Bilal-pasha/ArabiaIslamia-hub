import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';
import { Section } from './section.entity';
import { AcademicSession } from './academic-session.entity';
import { Attendance } from './attendance.entity';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Student, (s) => s.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'uuid', name: 'class_id' })
  classId: string;

  @ManyToOne(() => Class, (c) => c.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'uuid', name: 'section_id' })
  sectionId: string;

  @ManyToOne(() => Section, (s) => s.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column({ type: 'uuid', name: 'academic_session_id' })
  academicSessionId: string;

  @ManyToOne(() => AcademicSession, (as) => as.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_session_id' })
  academicSession: AcademicSession;

  @Column({ type: 'date', name: 'enrolled_at' })
  enrolledAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'roll_number' })
  rollNumber: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Attendance, (a) => a.registration)
  attendances: Attendance[];
}

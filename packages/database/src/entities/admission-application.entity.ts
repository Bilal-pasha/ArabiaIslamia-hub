import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from './class.entity';

@Entity('admission_applications')
export class AdmissionApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'application_number' })
  applicationNumber: string;

  @Column({ type: 'varchar', length: 150, name: 'name', default: '' })
  name: string;

  @Column({ type: 'varchar', length: 150, name: 'father_name', default: '' })
  fatherName: string;

  @Column({ type: 'date', name: 'date_of_birth', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 20, default: '' })
  gender: string;

  @Column({ type: 'varchar', length: 30, default: '' })
  phone: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  email: string;

  @Column({ type: 'varchar', length: 100, name: 'id_number', nullable: true })
  idNumber: string | null;

  @Column({ type: 'varchar', length: 500, default: '' })
  address: string;

  @Column({ type: 'varchar', length: 500, name: 'permanent_address', nullable: true })
  permanentAddress: string | null;

  @Column({ type: 'varchar', length: 100, default: '' })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  area: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  language: string | null;

  @Column({ type: 'varchar', length: 150, name: 'guardian_name', default: '' })
  guardianName: string;

  @Column({ type: 'varchar', length: 50, name: 'guardian_relation', default: '' })
  guardianRelation: string;

  @Column({ type: 'varchar', length: 30, name: 'guardian_phone', default: '' })
  guardianPhone: string;

  @Column({ type: 'varchar', length: 255, name: 'guardian_email', nullable: true })
  guardianEmail: string | null;

  @Column({ type: 'varchar', length: 100, name: 'guardian_occupation', nullable: true })
  guardianOccupation: string | null;

  @Column({ type: 'varchar', length: 500, name: 'guardian_address', nullable: true })
  guardianAddress: string | null;

  @Column({ type: 'uuid', name: 'required_class_id', nullable: true })
  requiredClassId: string | null;

  @ManyToOne(() => Class, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'required_class_id' })
  class: Class | null;

  @Column({ type: 'varchar', length: 200, name: 'previous_school', nullable: true })
  previousSchool: string | null;

  @Column({ type: 'varchar', length: 100, name: 'previous_class', nullable: true })
  previousClass: string | null;

  @Column({ type: 'varchar', length: 50, name: 'previous_grade', nullable: true })
  previousGrade: string | null;

  @Column({ type: 'varchar', length: 10, name: 'is_hafiz', nullable: true })
  isHafiz: string | null;

  @Column({ type: 'varchar', length: 50, name: 'accommodation_type', default: '' })
  accommodationType: string;

  @Column({ type: 'varchar', length: 500, name: 'photo_file_key', nullable: true })
  photoFileKey: string | null;

  @Column({ type: 'varchar', length: 500, name: 'id_file_key', nullable: true })
  idFileKey: string | null;

  @Column({ type: 'varchar', length: 500, name: 'authority_letter_file_key', nullable: true })
  authorityLetterFileKey: string | null;

  @Column({ type: 'varchar', length: 500, name: 'previous_result_file_key', nullable: true })
  previousResultFileKey: string | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 500, name: 'status_reason', nullable: true })
  statusReason: string | null;

  @Column({ type: 'boolean', name: 'quran_test_passed', nullable: true })
  quranTestPassed: boolean | null;

  @Column({ type: 'varchar', length: 20, name: 'quran_test_marks', nullable: true })
  quranTestMarks: string | null;

  @Column({ type: 'varchar', length: 500, name: 'quran_test_reason', nullable: true })
  quranTestReason: string | null;

  @Column({ type: 'varchar', length: 20, name: 'oral_test_marks', nullable: true })
  oralTestMarks: string | null;

  @Column({ type: 'boolean', name: 'oral_test_passed', nullable: true })
  oralTestPassed: boolean | null;

  @Column({ type: 'boolean', name: 'written_admit_eligible', default: false })
  writtenAdmitEligible: boolean;

  @Column({ type: 'boolean', name: 'written_test_passed', nullable: true })
  writtenTestPassed: boolean | null;

  @Column({ type: 'varchar', length: 20, name: 'written_test_marks', nullable: true })
  writtenTestMarks: string | null;

  @Column({ type: 'varchar', length: 500, name: 'written_test_reason', nullable: true })
  writtenTestReason: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}

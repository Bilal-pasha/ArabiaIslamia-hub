import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Madrasa } from './madrasa.entity';

@Entity('scouts_students')
export class ScoutsStudent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'madrasa_id', nullable: true })
  madrasaId: string | null;

  @ManyToOne(() => Madrasa, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'madrasa_id' })
  madrasa: Madrasa | null;

  @Column({ type: 'varchar', length: 255, name: 'madrasa_name', nullable: true })
  madrasaName: string | null;

  @Column({ type: 'varchar', length: 200, name: 'student_name', nullable: true })
  studentName: string | null;

  @Column({ type: 'varchar', length: 200, name: 'father_name', nullable: true })
  fatherName: string | null;

  @Column({ type: 'varchar', length: 50, name: 'age_group', nullable: true })
  ageGroup: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  grade: string | null;

  @Column({ type: 'varchar', length: 50, name: 'tshirt_size', nullable: true })
  TshirtSize: string | null;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: string;

  @Column({ type: 'varchar', length: 500, name: 'file_url', nullable: true })
  fileUrl: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  activity: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  group: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  camp: string | null;

  @Column({ type: 'varchar', length: 50, name: 'sub_camp', nullable: true })
  subCamp: string | null;

  @Column({ type: 'text', nullable: true })
  report: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 50, name: 'gr_number', nullable: true })
  GRNumber: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fees: string | null;

  @Column({ type: 'jsonb', name: 'fees_status_chart', nullable: true })
  feesStatusChart: unknown;

  @Column({ type: 'varchar', length: 100, name: 'class_slug', nullable: true })
  classSlug: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

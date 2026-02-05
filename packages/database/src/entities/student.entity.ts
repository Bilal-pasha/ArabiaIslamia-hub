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
import { User } from './user.entity';
import { Parent } from './parent.entity';
import { Registration } from './registration.entity';
import { FeePayment } from './fee-payment.entity';
import { AdmissionApplication } from './admission-application.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'uuid', name: 'parent_id', nullable: true })
  parentId: string | null;

  @ManyToOne(() => Parent, (p) => p.students, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Parent | null;

  @Column({ type: 'uuid', name: 'admission_application_id', nullable: true })
  admissionApplicationId: string | null;

  @ManyToOne(() => AdmissionApplication, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'admission_application_id' })
  admissionApplication: AdmissionApplication | null;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'date', name: 'date_of_birth', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'guardian_name' })
  guardianName: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  photo: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'roll_number' })
  rollNumber: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Registration, (reg) => reg.student)
  registrations: Registration[];

  @OneToMany(() => FeePayment, (fp) => fp.student)
  feePayments: FeePayment[];
}

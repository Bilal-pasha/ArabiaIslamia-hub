import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { FeeType } from './fee-type.entity';
import { AcademicSession } from './academic-session.entity';

@Entity('fee_structure')
export class FeeStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'class_id' })
  classId: string;

  @ManyToOne(() => Class, (c) => c.feeStructures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ type: 'uuid', name: 'fee_type_id' })
  feeTypeId: string;

  @ManyToOne(() => FeeType, (ft) => ft.feeStructures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fee_type_id' })
  feeType: FeeType;

  @Column({ type: 'uuid', name: 'academic_session_id' })
  academicSessionId: string;

  @ManyToOne(() => AcademicSession, (as) => as.feeStructures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'academic_session_id' })
  academicSession: AcademicSession;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FeeStructure } from './fee-structure.entity';
import { FeePayment } from './fee-payment.entity';

@Entity('fee_types')
export class FeeType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => FeeStructure, (fs) => fs.feeType)
  feeStructures: FeeStructure[];

  @OneToMany(() => FeePayment, (fp) => fp.feeType)
  feePayments: FeePayment[];
}

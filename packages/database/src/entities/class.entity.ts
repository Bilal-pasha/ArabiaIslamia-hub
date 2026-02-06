import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Section } from './section.entity';
import { Registration } from './registration.entity';
import { FeeStructure } from './fee-structure.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Section, (section) => section.class)
  sections: Section[];

  @OneToMany(() => Registration, (reg) => reg.class)
  registrations: Registration[];

  @OneToMany(() => FeeStructure, (fs) => fs.class)
  feeStructures: FeeStructure[];
}

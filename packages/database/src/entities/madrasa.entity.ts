import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScoutsUser } from './scouts-user.entity';

@Entity('madrasas')
export class Madrasa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'madrasa_name' })
  madrasaName: string;

  @Column({ type: 'varchar', length: 500, name: 'madrasa_address', nullable: true })
  madrasaAddress: string | null;

  @Column({ type: 'int', name: 'total_students', default: 0 })
  totalStudents: number;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => ScoutsUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: ScoutsUser;

  @Column({ type: 'varchar', length: 200, name: 'contact_person_name', nullable: true })
  contactPersonName: string | null;

  @Column({ type: 'varchar', length: 50, name: 'cell_number', nullable: true })
  cellNumber: string | null;

  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

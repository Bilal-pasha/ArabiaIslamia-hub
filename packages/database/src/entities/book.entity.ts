import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  isbn: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  category: string | null;

  @Column({ type: 'varchar', length: 100, name: 'jill_number', nullable: true })
  jillNumber: string | null;

  @Column({ type: 'varchar', length: 100, name: 'kitaab_number', nullable: true })
  kitaabNumber: string | null;

  @Column({ type: 'varchar', length: 255, name: 'muaraf_name', nullable: true })
  muarafName: string | null;

  @Column({ type: 'varchar', length: 255, name: 'naashir_name', nullable: true })
  naashirName: string | null;

  @Column({ type: 'varchar', length: 500, name: 'madah_unvaan', nullable: true })
  madahUnvaan: string | null;

  @Column({ type: 'varchar', length: 100, name: 'shelf_number', nullable: true })
  shelfNumber: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  keefiyat: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  milkiyat: string | null;

  @Column({ type: 'int', name: 'total_copies', default: 1 })
  totalCopies: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

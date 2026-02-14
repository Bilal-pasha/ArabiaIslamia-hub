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

  @Column({ type: 'int', name: 'total_copies', default: 1 })
  totalCopies: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_issues')
export class BookIssue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'book_id' })
  bookId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ type: 'varchar', length: 255, name: 'issued_to' })
  issuedTo: string;

  @Column({ type: 'timestamp', name: 'issued_at' })
  issuedAt: Date;

  @Column({ type: 'date', name: 'due_at' })
  dueAt: Date;

  @Column({ type: 'timestamp', name: 'returned_at', nullable: true })
  returnedAt: Date | null;

  @Column({ type: 'varchar', length: 50, default: 'issued' })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

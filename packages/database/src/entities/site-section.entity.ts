import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type SectionType =
  | 'white'
  | 'faculties'
  | 'statistics'
  | 'news'
  | 'donate';

@Entity('site_sections')
export class SiteSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, default: 'home' })
  page: string;

  @Column({ type: 'varchar', length: 50, name: 'section_key' })
  sectionKey: string;

  @Column({ type: 'varchar', length: 50, name: 'section_type' })
  sectionType: SectionType;

  @Column({ type: 'jsonb', nullable: true })
  content: Record<string, unknown> | null;

  @Column({ type: 'int', default: 0, name: 'sort_order' })
  sortOrder: number;

  @Column({ type: 'boolean', default: true, name: 'is_visible' })
  isVisible: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}

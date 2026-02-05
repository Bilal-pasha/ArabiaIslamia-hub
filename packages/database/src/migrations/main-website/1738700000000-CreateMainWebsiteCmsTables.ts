import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMainWebsiteCmsTables1738700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cms_admins',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'hero_slides',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'desktop_image_url', type: 'varchar', length: '500' },
          { name: 'mobile_image_url', type: 'varchar', length: '500' },
          { name: 'title', type: 'varchar', length: '255', default: "''" },
          { name: 'subtitle', type: 'varchar', length: '255', default: "''" },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'site_sections',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'page', type: 'varchar', length: '50', default: "'home'" },
          { name: 'section_key', type: 'varchar', length: '50' },
          { name: 'section_type', type: 'varchar', length: '50' },
          { name: 'content', type: 'jsonb', isNullable: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'is_visible', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('site_sections', true);
    await queryRunner.dropTable('hero_slides', true);
    await queryRunner.dropTable('cms_admins', true);
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBookAuthorsAndCategories1739500003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'book_authors',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'NOW()', isNullable: false },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()', isNullable: false },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'book_categories',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '200', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'NOW()', isNullable: false },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()', isNullable: false },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('book_categories', true);
    await queryRunner.dropTable('book_authors', true);
  }
}

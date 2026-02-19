import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBookNashirs1739500006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'book_nashirs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'created_at', type: 'timestamp', default: 'NOW()', isNullable: false },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()', isNullable: false },
        ],
      }),
      true,
    );
    // Backfill from existing books' naashir_name
    const rows = await queryRunner.query(
      `SELECT DISTINCT naashir_name FROM books WHERE naashir_name IS NOT NULL AND TRIM(naashir_name) != ''`,
    );
    for (const row of rows) {
      const name = row.naashir_name?.trim();
      if (name) {
        const existing = await queryRunner.query(`SELECT 1 FROM book_nashirs WHERE name = $1`, [name]);
        if (existing.length === 0) {
          await queryRunner.query(`INSERT INTO book_nashirs (id, name) VALUES (gen_random_uuid(), $1)`, [name]);
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('book_nashirs', true);
  }
}

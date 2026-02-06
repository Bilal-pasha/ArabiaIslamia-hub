import { MigrationInterface, QueryRunner } from 'typeorm';

const CLASSES: Array<{ name: string; sortOrder: number }> = [
  { name: 'pre-level', sortOrder: 1 },
  { name: 'level one', sortOrder: 2 },
  { name: 'level 2', sortOrder: 3 },
  { name: 'level 3', sortOrder: 4 },
  { name: 'huffaz english', sortOrder: 5 },
  { name: 'huffaz arabic', sortOrder: 6 },
  { name: '9th', sortOrder: 7 },
  { name: '10th', sortOrder: 8 },
];

export class SeedSecondaryClasses1738541300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.query<{ count: string }[]>(
      `SELECT COUNT(*) AS count FROM classes`
    );
    const count = parseInt(existing?.[0]?.count ?? '0', 10);
    if (count > 0) return;

    for (const row of CLASSES) {
      await queryRunner.query(
        `INSERT INTO classes (id, name, sort_order, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
        [row.name, row.sortOrder],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const row of CLASSES) {
      await queryRunner.query(`DELETE FROM classes WHERE name = $1`, [row.name]);
    }
  }
}

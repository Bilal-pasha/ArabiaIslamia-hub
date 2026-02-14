import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

async function createForeignKeyIfNotExists(
  queryRunner: QueryRunner,
  table: string,
  fk: TableForeignKey,
): Promise<void> {
  const spName = `sp_fk_${table}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await queryRunner.query(`SAVEPOINT ${spName}`);
  try {
    await queryRunner.createForeignKey(table, fk);
  } catch (err: unknown) {
    const e = err as { code?: string; driverError?: { code?: string } };
    const code = e?.code ?? e?.driverError?.code;
    if (code === '42710') {
      await queryRunner.query(`ROLLBACK TO SAVEPOINT ${spName}`);
    } else {
      throw err;
    }
  }
}

export class AddQuranAndWrittenTestColumns1738541100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "quran_test_passed" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "quran_test_marks" varchar(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "quran_test_reason" varchar(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "written_test_passed" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "written_test_marks" varchar(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "written_test_reason" varchar(500)`,
    );

    await queryRunner.query(
      `ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "admission_application_id" uuid`,
    );
    await createForeignKeyIfNotExists(
      queryRunner,
      'students',
      new TableForeignKey({
        columnNames: ['admission_application_id'],
        referencedTableName: 'admission_applications',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const studentsTable = await queryRunner.getTable('students');
    const fk = studentsTable?.foreignKeys.find((f) => f.columnNames.includes('admission_application_id'));
    if (fk) await queryRunner.dropForeignKey('students', fk);
    await queryRunner.dropColumn('students', 'admission_application_id');

    await queryRunner.dropColumn('admission_applications', 'written_test_reason');
    await queryRunner.dropColumn('admission_applications', 'written_test_marks');
    await queryRunner.dropColumn('admission_applications', 'written_test_passed');
    await queryRunner.dropColumn('admission_applications', 'quran_test_reason');
    await queryRunner.dropColumn('admission_applications', 'quran_test_marks');
    await queryRunner.dropColumn('admission_applications', 'quran_test_passed');
  }
}

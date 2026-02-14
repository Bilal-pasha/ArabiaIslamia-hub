import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

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

export class AdmissionApplicationRequiredClassId1738541400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "required_class_id" uuid`,
    );
    await createForeignKeyIfNotExists(
      queryRunner,
      'admission_applications',
      new TableForeignKey({
        columnNames: ['required_class_id'],
        referencedTableName: 'classes',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" DROP COLUMN IF EXISTS "required_class"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'required_class',
        type: 'varchar',
        length: '100',
        default: "''",
      }),
    );
    const fk = (await queryRunner.getTable('admission_applications'))?.foreignKeys.find(
      (k) => k.columnNames.indexOf('required_class_id') !== -1,
    );
    if (fk) {
      await queryRunner.dropForeignKey('admission_applications', fk);
    }
    await queryRunner.dropColumn('admission_applications', 'required_class_id');
  }
}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

let fkSavepointId = 0;

async function createForeignKeyIfNotExists(
  queryRunner: QueryRunner,
  table: string,
  fk: TableForeignKey,
): Promise<void> {
  const spName = `sp_fk_${table}_${++fkSavepointId}`;
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

export class CreateRenewalApplicationsTable1738541200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'renewal_applications',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'student_id', type: 'uuid' },
          { name: 'academic_session_id', type: 'uuid' },
          { name: 'class_id', type: 'uuid' },
          { name: 'section_id', type: 'uuid' },
          { name: 'contact_override', type: 'varchar', length: '30', isNullable: true },
          { name: 'address_override', type: 'varchar', length: '500', isNullable: true },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'status_reason', type: 'varchar', length: '500', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    await createForeignKeyIfNotExists(
      queryRunner,
      'renewal_applications',
      new TableForeignKey({
        columnNames: ['student_id'],
        referencedTableName: 'students',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await createForeignKeyIfNotExists(
      queryRunner,
      'renewal_applications',
      new TableForeignKey({
        columnNames: ['academic_session_id'],
        referencedTableName: 'academic_sessions',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await createForeignKeyIfNotExists(
      queryRunner,
      'renewal_applications',
      new TableForeignKey({
        columnNames: ['class_id'],
        referencedTableName: 'classes',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await createForeignKeyIfNotExists(
      queryRunner,
      'renewal_applications',
      new TableForeignKey({
        columnNames: ['section_id'],
        referencedTableName: 'sections',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('renewal_applications');
    const fks = table?.foreignKeys ?? [];
    for (const fk of fks) {
      await queryRunner.dropForeignKey('renewal_applications', fk);
    }
    await queryRunner.dropTable('renewal_applications', true);
  }
}

import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddQuranAndWrittenTestColumns1738541100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({ name: 'quran_test_passed', type: 'boolean', isNullable: true }),
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({ name: 'quran_test_marks', type: 'varchar', length: '20', isNullable: true }),
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({ name: 'quran_test_reason', type: 'varchar', length: '500', isNullable: true }),
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({ name: 'written_test_passed', type: 'boolean', isNullable: true }),
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({ name: 'written_test_marks', type: 'varchar', length: '20', isNullable: true }),
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({ name: 'written_test_reason', type: 'varchar', length: '500', isNullable: true }),
    );

    await queryRunner.addColumn(
      'students',
      new TableColumn({ name: 'admission_application_id', type: 'uuid', isNullable: true }),
    );
    await queryRunner.createForeignKey(
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

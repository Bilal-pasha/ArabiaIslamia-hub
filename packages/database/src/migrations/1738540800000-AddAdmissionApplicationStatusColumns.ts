import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAdmissionApplicationStatusColumns1738540800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'status_reason',
        type: 'varchar',
        length: '500',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'oral_test_marks',
        type: 'varchar',
        length: '20',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'oral_test_passed',
        type: 'boolean',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'written_admit_eligible',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('admission_applications', 'written_admit_eligible');
    await queryRunner.dropColumn('admission_applications', 'oral_test_passed');
    await queryRunner.dropColumn('admission_applications', 'oral_test_marks');
    await queryRunner.dropColumn('admission_applications', 'status_reason');
  }
}

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveMadhabAddAreaLanguage1738541000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('admission_applications', 'madhab');
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'area',
        type: 'varchar',
        length: '150',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'language',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('admission_applications', 'language');
    await queryRunner.dropColumn('admission_applications', 'area');
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'madhab',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );
  }
}

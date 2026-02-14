import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveMadhabAddAreaLanguage1738541000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admission_applications" DROP COLUMN IF EXISTS "madhab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "area" varchar(150)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "language" varchar(100)`,
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

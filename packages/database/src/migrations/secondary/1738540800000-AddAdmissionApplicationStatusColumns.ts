import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdmissionApplicationStatusColumns1738540800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Use IF NOT EXISTS so migration is safe when columns were already created by synchronize
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "status_reason" varchar(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "oral_test_marks" varchar(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "oral_test_passed" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "admission_applications" ADD COLUMN IF NOT EXISTS "written_admit_eligible" boolean DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('admission_applications', 'written_admit_eligible');
    await queryRunner.dropColumn('admission_applications', 'oral_test_passed');
    await queryRunner.dropColumn('admission_applications', 'oral_test_marks');
    await queryRunner.dropColumn('admission_applications', 'status_reason');
  }
}

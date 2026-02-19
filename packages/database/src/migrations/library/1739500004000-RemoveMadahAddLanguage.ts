import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveMadahAddLanguage1739500004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" DROP COLUMN IF EXISTS "madah_unvaan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "language" varchar(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "madah_unvaan" varchar(500)`,
    );
    await queryRunner.dropColumn('books', 'language');
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookExtendedFields1739500002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "jill_number" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "kitaab_number" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "muaraf_name" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "naashir_name" varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "madah_unvaan" varchar(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "shelf_number" varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "keefiyat" varchar(200)`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "milkiyat" varchar(200)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('books', 'milkiyat');
    await queryRunner.dropColumn('books', 'keefiyat');
    await queryRunner.dropColumn('books', 'shelf_number');
    await queryRunner.dropColumn('books', 'madah_unvaan');
    await queryRunner.dropColumn('books', 'naashir_name');
    await queryRunner.dropColumn('books', 'muaraf_name');
    await queryRunner.dropColumn('books', 'kitaab_number');
    await queryRunner.dropColumn('books', 'jill_number');
  }
}

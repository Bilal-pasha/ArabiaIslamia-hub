import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookNumber1739500005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "book_number_seq"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD COLUMN IF NOT EXISTS "book_number" varchar(50)`,
    );
    // Backfill existing books with sequential numbers
    const rows = await queryRunner.query(
      `SELECT id FROM "books" ORDER BY "created_at" ASC`,
    );
    for (let i = 0; i < rows.length; i++) {
      const num = String(i + 1).padStart(6, '0');
      await queryRunner.query(
        `UPDATE "books" SET "book_number" = $1 WHERE "id" = $2`,
        [`BKN-${num}`, rows[i].id],
      );
    }
    await queryRunner.query(`
      DO $$
      DECLARE
        max_val INTEGER;
      BEGIN
        SELECT COALESCE(MAX(CAST(SUBSTRING("book_number" FROM 5) AS INTEGER)), 0) INTO max_val
        FROM "books" WHERE "book_number" LIKE 'BKN-%';
        IF max_val = 0 THEN
          PERFORM setval('book_number_seq', 1, false);
        ELSE
          PERFORM setval('book_number_seq', max_val, true);
        END IF;
      END $$;
    `);
    await queryRunner.query(
      `ALTER TABLE "books" ALTER COLUMN "book_number" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_books_book_number" ON "books" ("book_number")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_books_book_number"`);
    await queryRunner.dropColumn('books', 'book_number');
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "book_number_seq"`);
  }
}

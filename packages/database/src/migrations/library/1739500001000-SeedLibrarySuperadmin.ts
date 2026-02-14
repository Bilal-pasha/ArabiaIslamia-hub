import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

const SUPERADMIN_USERNAME = 'admin';
/** Default password: change after first login. */
const SUPERADMIN_PLAIN_PASSWORD = 'Admin123!';

export class SeedLibrarySuperadmin1739500001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.query(
      `SELECT 1 FROM library_users WHERE username = $1 LIMIT 1`,
      [SUPERADMIN_USERNAME],
    );
    if (Array.isArray(existing) && existing.length > 0) return;

    const hash = await bcrypt.hash(SUPERADMIN_PLAIN_PASSWORD, 10);
    await queryRunner.query(
      `INSERT INTO library_users (id, username, password, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())`,
      [SUPERADMIN_USERNAME, hash],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM library_users WHERE username = $1`, [
      SUPERADMIN_USERNAME,
    ]);
  }
}

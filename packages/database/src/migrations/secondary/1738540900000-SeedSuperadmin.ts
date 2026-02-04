import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

const SUPERADMIN_EMAIL = 'superadmin@arabiaaislamia.com';
const SUPERADMIN_NAME = 'Super Admin';
/** Default password: change after first login. Must satisfy app password policy. */
const SUPERADMIN_PLAIN_PASSWORD = 'SuperAdmin123!';

export class SeedSuperadmin1738540900000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.query(
      `SELECT 1 FROM users WHERE email = $1 LIMIT 1`,
      [SUPERADMIN_EMAIL],
    );
    if (Array.isArray(existing) && existing.length > 0) return;

    const hash = await bcrypt.hash(SUPERADMIN_PLAIN_PASSWORD, 10);
    await queryRunner.query(
      `INSERT INTO users (id, name, email, password, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 'superadmin', NOW(), NOW())`,
      [SUPERADMIN_NAME, SUPERADMIN_EMAIL, hash],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE email = $1`, [
      SUPERADMIN_EMAIL,
    ]);
  }
}

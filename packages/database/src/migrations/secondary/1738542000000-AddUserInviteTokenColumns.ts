import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserInviteTokenColumns1738542000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "invite_token" varchar(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "invite_token_expires_at" timestamp`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'invite_token_expires_at');
    await queryRunner.dropColumn('users', 'invite_token');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateEmailLogsTable1738542100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'email_logs',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'to', type: 'varchar', length: '500', isNullable: false },
          { name: 'recipient_name', type: 'varchar', length: '255', isNullable: true },
          { name: 'subject', type: 'varchar', length: '255', isNullable: false },
          { name: 'status', type: 'varchar', length: '20', default: "'success'", isNullable: false },
          { name: 'error_message', type: 'text', isNullable: true },
          { name: 'context', type: 'varchar', length: '100', isNullable: true },
          { name: 'metadata', type: 'jsonb', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()', isNullable: false },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('email_logs', true);
  }
}

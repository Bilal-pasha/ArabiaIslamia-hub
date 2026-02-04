import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdmissionApplicationsTable1738540700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admission_applications',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'application_number', type: 'varchar', length: '50', isUnique: true },
          { name: 'name', type: 'varchar', length: '150', default: '' },
          { name: 'father_name', type: 'varchar', length: '150', default: '' },
          { name: 'date_of_birth', type: 'date', isNullable: true },
          { name: 'gender', type: 'varchar', length: '20', default: '' },
          { name: 'phone', type: 'varchar', length: '30', default: '' },
          { name: 'email', type: 'varchar', length: '255', default: '' },
          { name: 'id_number', type: 'varchar', length: '100', isNullable: true },
          { name: 'address', type: 'varchar', length: '500', default: '' },
          { name: 'permanent_address', type: 'varchar', length: '500', isNullable: true },
          { name: 'country', type: 'varchar', length: '100', default: '' },
          { name: 'state', type: 'varchar', length: '100', isNullable: true },
          { name: 'city', type: 'varchar', length: '100', isNullable: true },
          { name: 'guardian_name', type: 'varchar', length: '150', default: '' },
          { name: 'guardian_relation', type: 'varchar', length: '50', default: '' },
          { name: 'guardian_phone', type: 'varchar', length: '30', default: '' },
          { name: 'guardian_email', type: 'varchar', length: '255', isNullable: true },
          { name: 'guardian_occupation', type: 'varchar', length: '100', isNullable: true },
          { name: 'guardian_address', type: 'varchar', length: '500', isNullable: true },
          { name: 'required_class', type: 'varchar', length: '100', default: '' },
          { name: 'previous_school', type: 'varchar', length: '200', isNullable: true },
          { name: 'previous_class', type: 'varchar', length: '100', isNullable: true },
          { name: 'previous_grade', type: 'varchar', length: '50', isNullable: true },
          { name: 'is_hafiz', type: 'varchar', length: '10', isNullable: true },
          { name: 'accommodation_type', type: 'varchar', length: '50', default: '' },
          { name: 'madhab', type: 'varchar', length: '50', isNullable: true },
          { name: 'photo_file_key', type: 'varchar', length: '500', isNullable: true },
          { name: 'id_file_key', type: 'varchar', length: '500', isNullable: true },
          { name: 'authority_letter_file_key', type: 'varchar', length: '500', isNullable: true },
          { name: 'previous_result_file_key', type: 'varchar', length: '500', isNullable: true },
          { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admission_applications', true);
  }
}

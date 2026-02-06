import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AdmissionApplicationRequiredClassId1738541400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'required_class_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
    await queryRunner.createForeignKey(
      'admission_applications',
      new TableForeignKey({
        columnNames: ['required_class_id'],
        referencedTableName: 'classes',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.dropColumn('admission_applications', 'required_class');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'admission_applications',
      new TableColumn({
        name: 'required_class',
        type: 'varchar',
        length: '100',
        default: "''",
      }),
    );
    const fk = (await queryRunner.getTable('admission_applications'))?.foreignKeys.find(
      (k) => k.columnNames.indexOf('required_class_id') !== -1,
    );
    if (fk) {
      await queryRunner.dropForeignKey('admission_applications', fk);
    }
    await queryRunner.dropColumn('admission_applications', 'required_class_id');
  }
}

import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class RemoveRapportsActivitesFromAtelier implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Supprimer la clé étrangère si elle existe
    const table = await queryRunner.getTable('atelier');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('collaborateur_id') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('atelier', foreignKey);
    }

    // Supprimer la colonne collaborateur_id si elle existe
    await queryRunner.dropColumn('atelier', 'collaborateur_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Ajouter la colonne collaborateur_id
    await queryRunner.addColumn('atelier', new TableColumn({
      name: 'collaborateur_id',
      type: 'int',
      isNullable: true,
    }));

    // Ajouter la clé étrangère pour collaborateur_id
    await queryRunner.createForeignKey('atelier', new TableForeignKey({
      columnNames: ['collaborateur_id'],
      referencedTableName: 'collaborateurs',
      referencedColumnNames: ['collaborateur_id'],
      onDelete: 'SET NULL', // Modifier selon le comportement souhaité
    }));
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHeuresTravailToAtelier1633456789012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE atelier
      ADD COLUMN heures_travail INT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE atelier
      DROP COLUMN heures_travail;
    `);
  }
}

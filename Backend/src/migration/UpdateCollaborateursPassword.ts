import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUtilisateurFromCollaborateurs1719995408078 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE collaborateurs DROP COLUMN utilisateur_id`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE collaborateurs ADD COLUMN utilisateur_id integer`);
  }
}

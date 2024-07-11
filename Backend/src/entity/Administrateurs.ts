import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "administrateurs" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class Administrateurs {
  @PrimaryGeneratedColumn()
  admin_id!: number;

  @Column({ length: 50 })
  nom_utilisateur!: string;

  @Column({ length: 255 })
  mot_de_passe!: string;

  @Column({ length: 50, nullable: true })
  role!: string;

  @Column({ type: "text", nullable: true })
  permissions!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  cree_le!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  modifie_le!: Date;
}

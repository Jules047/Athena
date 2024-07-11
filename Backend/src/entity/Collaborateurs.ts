import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "collaborateurs" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class Collaborateurs {
  @PrimaryGeneratedColumn()
  collaborateur_id!: number;

  @Column({ length: 50 })
  prenom!: string;

  @Column({ length: 50 })
  nom!: string;

  @Column({ length: 20, nullable: true })
  qualification!: string;

  @Column({ type: "text", nullable: true })
  droits_acces!: string;

  @Column({ length: 255, default: 'defaultpassword' })  // Ajouter une valeur par défaut
  mot_de_passe!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  cree_le!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  modifie_le!: Date;
}

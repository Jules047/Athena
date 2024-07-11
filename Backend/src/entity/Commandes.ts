import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "commandes" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class Commandes {
  @PrimaryGeneratedColumn()
  commande_id!: number;

  @Column({ length: 100 })
  nom_commande!: string;

  @Column({ type: "int", nullable: true })
  client_id!: number;

  @Column({ length: 50, nullable: true })
  statut_commande!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  cree_le!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  modifie_le!: Date;
}

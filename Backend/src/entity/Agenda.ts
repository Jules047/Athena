import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Utilisateurs } from "./Utilisateurs";

@Entity({ name: "agenda" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class Agenda {
  @PrimaryGeneratedColumn()
  agenda_id!: number;

  @ManyToOne(() => Utilisateurs, utilisateur => utilisateur.utilisateur_id)
  @JoinColumn({ name: "utilisateur_id" })
  utilisateur!: Utilisateurs;

  @Column({ length: 100 })
  titre!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "time" })
  heure!: string;

  @Column({ length: 50, nullable: true })
  type!: string;

  @Column({ length: 20, nullable: true })
  statut!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  cree_le!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  modifie_le!: Date;
}

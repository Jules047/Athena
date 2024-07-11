import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Utilisateurs } from "./Utilisateurs";

@Entity({ name: "statistiques" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class Statistiques {
  @PrimaryGeneratedColumn()
  stat_id!: number;

  @ManyToOne(() => Utilisateurs, utilisateur => utilisateur.utilisateur_id)
  @JoinColumn({ name: "utilisateur_id" })
  utilisateur!: Utilisateurs;

  @Column({ length: 50 })
  type_activité!: string;

  @Column({ type: "date" })
  date_activité!: Date;

  @Column({ type: "interval" })
  durée_activité!: any;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  coût!: number;
}

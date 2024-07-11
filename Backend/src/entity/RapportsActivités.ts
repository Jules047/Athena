import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Utilisateurs } from "./Utilisateurs";
import { Commandes } from "./Commandes";

@Entity({ name: "rapports_activités" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class RapportsActivités {
  @PrimaryGeneratedColumn()
  rapport_id!: number;

  @ManyToOne(() => Utilisateurs, utilisateur => utilisateur.utilisateur_id)
  @JoinColumn({ name: "utilisateur_id" })
  utilisateur!: Utilisateurs;

  @ManyToOne(() => Commandes, commande => commande.commande_id)
  @JoinColumn({ name: "commande_id" })
  commande!: Commandes;

  @Column({ type: "date" })
  date!: Date;

  @Column({ length: 50 })
  type_activité!: string;

  @Column({ type: "interval" })
  durée!: any;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  coût!: number;
}

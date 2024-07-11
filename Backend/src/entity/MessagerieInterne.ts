import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Utilisateurs } from "./Utilisateurs";

@Entity({ name: "messagerie_interne" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class MessagerieInterne {
  @PrimaryGeneratedColumn()
  message_id!: number;

  @ManyToOne(() => Utilisateurs, utilisateur => utilisateur.utilisateur_id)
  @JoinColumn({ name: "expéditeur_id" })
  expéditeur!: Utilisateurs;

  @ManyToOne(() => Utilisateurs, utilisateur => utilisateur.utilisateur_id)
  @JoinColumn({ name: "destinataire_id" })
  destinataire!: Utilisateurs;

  @Column({ length: 100 })
  objet!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "date" })
  date_envoi!: Date;

  @Column({ type: "time" })
  heure_envoi!: string;

  @Column({ type: "text", nullable: true })
  pièces_jointes!: string;

  @Column({ length: 20, nullable: true })
  statut!: string;
}

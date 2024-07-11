import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "atelier" })  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class Atelier {
  @PrimaryGeneratedColumn()
  atelier_id!: number;

  @Column({ length: 50 })
  type_tâche!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  taux_horaire!: number;

  @Column({ length: 20, nullable: true })
  qualification!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  coût!: number;

  @Column({ type: "int" }) // Ajouter cette ligne
  heures_travail!: number;
}

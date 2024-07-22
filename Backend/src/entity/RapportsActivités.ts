import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Collaborateurs } from "./Collaborateurs";
import { Atelier } from "./Atelier";
import { Project } from "./Project";
import { Commandes } from "./Commandes";

@Entity({ name: "rapports_activités" })
export class RapportsActivités {
  @PrimaryGeneratedColumn()
  rapport_id!: number;

  @ManyToOne(() => Collaborateurs, collaborateur => collaborateur.collaborateur_id)
  @JoinColumn({ name: "collaborateur_id" })
  collaborateur!: Collaborateurs;

  @ManyToOne(() => Atelier, atelier => atelier.atelier_id)
  @JoinColumn({ name: "atelier_id" })
  atelier!: Atelier;

  @ManyToOne(() => Project, project => project.id)
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => Commandes, commande => commande.commande_id)
  @JoinColumn({ name: "commande_id" })
  commande!: Commandes;

  @Column({ type: "date" })
  date!: Date;

  @Column({ type: "int" })
  durée!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  coût!: number;

  @Column({ nullable: true }) 
  filePath?: string;
}

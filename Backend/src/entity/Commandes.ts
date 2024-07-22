import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { RapportsActivités } from './RapportsActivités';

@Entity({ name: "commandes" })
export class Commandes {
  @PrimaryGeneratedColumn()
  commande_id!: number;

  @Column({ length: 100 })
  nom!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  type?: string;

  @Column({ type: "int", nullable: true })
  estimation?: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  cree_le!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  modifie_le!: Date;

  @OneToMany(() => RapportsActivités, (rapport) => rapport.commande)
  rapportsActivités!: RapportsActivités[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Atelier } from './Atelier';

@Entity({ name: "collaborateurs" })
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

  @Column({ length: 255, default: 'defaultpassword' })
  mot_de_passe!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  cree_le!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  modifie_le!: Date;

  @OneToMany(() => Atelier, (atelier) => atelier.collaborateur)
  ateliers!: Atelier[];
}

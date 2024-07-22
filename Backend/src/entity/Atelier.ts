// src/entity/Atelier.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Collaborateurs } from './Collaborateurs';

@Entity({ name: 'atelier' })
export class Atelier {
  @PrimaryGeneratedColumn()
  atelier_id!: number;

  @Column({ length: 50 })
  type_tache!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taux_horaire!: number;

  @Column({ length: 20, nullable: true })
  qualification!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cout!: number;

  @Column({ type: 'int' })
  heures_travail!: number;

  @ManyToOne(() => Collaborateurs, (collaborateur) => collaborateur.ateliers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  collaborateur?: Collaborateurs;
}

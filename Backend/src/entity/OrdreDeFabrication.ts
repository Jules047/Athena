import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Utilisateurs } from './Utilisateurs';

@Entity({ name: 'ordres_de_fabrication' })
export class OrdreDeFabrication {
  @PrimaryGeneratedColumn()
  of_id!: number;

  @Column({ length: 255 })
  nom_affaire!: string;

  @Column('text', { nullable: true })
  description?: string;

  @CreateDateColumn()
  date_creation!: Date;

  @ManyToOne(() => Utilisateurs)
  @JoinColumn({ name: 'cree_par' })
  cree_par!: Utilisateurs;

  @Column('text', { array: true, nullable: true })
  plans?: string[];

  @Column('text', { array: true, nullable: true })
  annotations?: string[];

  @Column('text', { array: true, nullable: true })
  plans_fournisseurs?: string[];

  @Column('text', { nullable: true })
  details_poseurs?: string;

  @UpdateDateColumn()
  derniere_mise_a_jour!: Date;

  @ManyToOne(() => Utilisateurs)
  @JoinColumn({ name: 'mis_a_jour_par' })
  mis_a_jour_par!: Utilisateurs;
}

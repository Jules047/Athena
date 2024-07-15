import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Utilisateurs } from './Utilisateurs';
import { Document } from './Document';

@Entity()
export class OfValidated {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Project, project => project.ofValidated)
    project!: Project;

  @ManyToOne(() => Utilisateurs)
    createdBy!: Utilisateurs;

  @Column({ nullable: true })
    approvedBy!: string;

  @Column({ nullable: true })
    approvedAt!: Date;

  @OneToMany(() => Document, document => document.ofValidated)
    documents!: Document[];
}

export default OfValidated;

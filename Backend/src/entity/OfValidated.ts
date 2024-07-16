import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Utilisateurs } from './Utilisateurs';
import { Document } from './Document';

@Entity()
export class OfValidated {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => Utilisateurs)
    createdBy!: Utilisateurs;

  @Column({ nullable: true })
    approvedBy!: string;

  @Column({ nullable: true })
    approvedAt!: Date;

  @OneToMany(() => Document, document => document.ofValidated)
    documents!: Document[];

  @ManyToOne(() => Project) // Update the type of the relationship
    ofValidated!: Project; // Update the property name
}

export default OfValidated;

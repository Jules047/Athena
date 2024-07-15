import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OfValidated } from './OfValidated';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    name!: string;

  @Column({ nullable: true })
    description!: string;

  @Column()
    status!: string;

  @OneToMany(() => OfValidated, ofValidated => ofValidated.project)
    ofValidated!: OfValidated[];
}

export default Project;

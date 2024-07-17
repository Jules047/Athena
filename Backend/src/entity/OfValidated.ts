import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Project } from './Project';
import { Utilisateurs } from './Utilisateurs';

@Entity()
export class OfValidated {
  @PrimaryGeneratedColumn()
  of_id!: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @ManyToOne(() => Utilisateurs)
  @JoinColumn({ name: 'created_by' })
  created_by!: Utilisateurs;

  @ManyToOne(() => Utilisateurs, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by?: Utilisateurs;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  approved_at!: Date;
}

export default OfValidated;

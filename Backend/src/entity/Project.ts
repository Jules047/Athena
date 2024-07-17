import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column()
    name!: string;

  @Column({ nullable: true })
    description?: string;

  @Column()
    status!: string;

  @Column({ nullable: true }) // Permettre temporairement NULL pour éviter des erreurs lors de la création initiale
    filePath?: string;

  @CreateDateColumn({ type: 'timestamp' })
    cree_le!: Date;
  ofValidated: any;
}

export default Project;

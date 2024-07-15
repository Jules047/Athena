import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OfValidated } from './OfValidated';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
    id!: number;

  @ManyToOne(() => OfValidated, ofValidated => ofValidated.documents)
    ofValidated!: OfValidated;

  @Column()
    fileName!: string;

  @Column()
    filePath!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    uploadedAt!: Date;
}

export default Document;

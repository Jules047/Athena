import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()  // Assurez-vous que le nom de la table correspond à celui de votre base de données
export class Utilisateurs {
  password: string | undefined;
    static findOne(arg0: { where: { prénom: any; }; }) {
        throw new Error('Method not implemented.');
    }
    static create(arg0: { prénom: any; nom: any; qualification: any; droits_acces: any; mot_de_passe: string; role: any; }) {
        throw new Error('Method not implemented.');
    }
  @PrimaryGeneratedColumn()
  utilisateur_id!: number;

  @Column({ length: 50 })
  prenom!: string;

  @Column({ length: 50 })
  nom!: string;

  @Column({ length: 20, nullable: true })
  qualification!: string;

  @Column({ type: "text", nullable: true })
  droits_acces!: string;

  @Column({ length: 255 })
  mot_de_passe!: string;

  @Column({ length: 50, nullable: true })
  role!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  cree_le!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  modifie_le!: Date;
    rôle: any;
}

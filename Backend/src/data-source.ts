import { DataSource } from 'typeorm';
import "reflect-metadata";
import { Project } from './entity/Project';
import { Utilisateurs } from './entity/Utilisateurs';
import { OfValidated } from './entity/OfValidated';
import { Document } from './entity/Document';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "athena",
  synchronize: true,
  logging: true,
  entities: [Project, Utilisateurs, OfValidated, Document],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

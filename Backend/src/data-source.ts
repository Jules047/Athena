import { DataSource } from "typeorm";
import "reflect-metadata";
import path from "path";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "athena",
  synchronize: false, // Ensure this is false in production to avoid unintended schema changes
  logging: false,
  entities: [path.join(__dirname, '/entities/*.ts')],
  migrations: [path.join(__dirname, '/migration/*.ts')],
  subscribers: [path.join(__dirname, '/subscriber/**/*.ts')],
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

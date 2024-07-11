import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv'; // Import dotenv
import authRoutes from './routes/authRoutes';
import collaborateurRoutes from './routes/collaborateurRoutes';
import auth from './middleware/authMiddleware';
import { Collaborateurs } from './entity/Collaborateurs';
import { Utilisateurs } from './entity/Utilisateurs';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Data Source
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'athena',
  synchronize: true,
  logging: false,
  entities: [Collaborateurs, Utilisateurs],
  migrations: ['src/migration/*.ts'],
  subscribers: [],
});

dataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');

  // Middleware
  app.use(morgan('dev'));
  app.use(cors());
  app.use(bodyParser.json());

  // Routes
  app.use('/auth', authRoutes);
  app.use('/api/collaborateurs', auth, collaborateurRoutes); // Protect this route with the auth middleware

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error('Error during Data Source initialization:', err);
});

import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import UtilisateursRoutes from "./routes/UtilisateursRoutes";
import adminRoutes from "./routes/adminRoutes";
import statRoutes from "./routes/statRoutes";
import commandeRoutes from "./routes/commandeRoutes";
import collaborateurRoutes from "./routes/collaborateurRoutes";
import atelierRoutes from "./routes/atelierRoutes";
import rapportActivitesRoutes from "./routes/rapportActivitesRoutes";
import messagerieRoutes from "./routes/messagerieRoutes";
import agendaRoutes from "./routes/agendaRoutes";
import AuthRoutes from "./routes/authRoutes";
import authMiddleware from "./middleware/authMiddleware";
import ordreDeFabricationRoutes from "./routes/ordreDeFabricationRoutes";
import projectRoutes from "./routes/projectRoutes";
import ofValidatedRoutes from "./routes/ofValidatedRoutes";
import path from "path";
import fs from "fs";

dotenv.config(); // Charge les variables d'environnement à partir du fichier .env

createConnection().then(async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/auth', AuthRoutes);
  app.use('/utilisateurs', authMiddleware, UtilisateursRoutes);
  app.use('/administrateurs', authMiddleware, adminRoutes);
  app.use('/statistiques', authMiddleware, statRoutes);
  app.use('/commandes', authMiddleware, commandeRoutes);
  app.use('/collaborateurs', authMiddleware, collaborateurRoutes);
  app.use('/ateliers', authMiddleware, atelierRoutes);
  app.use('/rapport', authMiddleware, rapportActivitesRoutes);
  app.use('/messagerieInterne', authMiddleware, messagerieRoutes);
  app.use('/agenda', authMiddleware, agendaRoutes);
  app.use('/ordres-de-fabrication', ordreDeFabricationRoutes);
  app.use('/projects', projectRoutes);
  app.use('/of_validated', ofValidatedRoutes);

  // Serve static files from the "uploads" directory
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Route to download uploaded file
  app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    console.log(`Request to download file at ${filePath}`);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.sendFile(filePath);
    } else {
      console.error(`File not found at ${filePath}`);
      res.status(404).send('File not found');
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}).catch(error => console.log(error));

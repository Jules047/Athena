import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { RapportsActivités } from '../entity/RapportsActivités';
import { Collaborateurs } from '../entity/Collaborateurs';
import { Atelier } from '../entity/Atelier';
import { Project } from '../entity/Project';
import { Commandes } from '../entity/Commandes';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body, validationResult } from 'express-validator';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Helper function to fetch and validate relations
const fetchAndValidateRelations = async (collaborateur_id: number, atelier_id: number, project_id: number, commande_id: number) => {
  const [collaborateur, atelier, project, commande] = await Promise.all([
    getRepository(Collaborateurs).findOne({ where: { collaborateur_id } }),
    getRepository(Atelier).findOne({ where: { atelier_id } }),
    getRepository(Project).findOne({ where: { id: project_id } }),
    getRepository(Commandes).findOne({ where: { commande_id } })
  ]);

  if (!collaborateur || !atelier || !project || !commande) {
    throw new Error('Invalid relations');
  }

  return { collaborateur, atelier, project, commande };
};

router.get('/', async (req, res) => {
  try {
    const rapports = await getRepository(RapportsActivités).find({
      relations: ["collaborateur", "atelier", "project", "commande"]
    });
    res.json(rapports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rapports", error: (error as any).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rapport = await getRepository(RapportsActivités).findOne({
      where: { rapport_id: +req.params.id },
      relations: ["collaborateur", "atelier", "project", "commande"]
    } as FindOneOptions<RapportsActivités>);

    if (rapport) {
      res.json(rapport);
    } else {
      res.status(404).json({ message: 'Rapport not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching rapport", error: (error as any).message });
  }
});

router.post('/', upload.single('file'),
  body('collaborateur_id').isNumeric(),
  body('atelier_id').isNumeric(),
  body('project_id').isNumeric(),
  body('commande_id').isNumeric(),
  body('date').isISO8601(),
  body('durée').isNumeric(),
  body('coût').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { collaborateur_id, atelier_id, project_id, commande_id, date, durée, coût } = req.body;
      const { collaborateur, atelier, project, commande } = await fetchAndValidateRelations(+collaborateur_id, +atelier_id, +project_id, +commande_id);

      const rapport = new RapportsActivités();
      rapport.collaborateur = collaborateur;
      rapport.atelier = atelier;
      rapport.project = project;
      rapport.commande = commande;
      rapport.date = date;
      rapport.durée = +durée;
      rapport.coût = +coût;

      if (req.file) {
        rapport.filePath = `/uploads/${req.file.filename}`;
      }

      const result = await getRepository(RapportsActivités).save(rapport);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error in POST /', error); // Log the error
      res.status(400).json({ message: 'Error creating rapport', error: (error as any).message });
    }
  }
);


router.put('/:id', upload.single('file'),
  body('collaborateur_id').isNumeric(),
  body('atelier_id').isNumeric(),
  body('project_id').isNumeric(),
  body('commande_id').isNumeric(),
  body('date').isISO8601(),
  body('durée').isNumeric(),
  body('coût').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { collaborateur_id, atelier_id, project_id, commande_id, date, durée, coût } = req.body;
      const rapport = await getRepository(RapportsActivités).findOne({
        where: { rapport_id: +req.params.id }
      } as FindOneOptions<RapportsActivités>);

      if (!rapport) {
        return res.status(404).json({ message: 'Rapport not found' });
      }

      const { collaborateur, atelier, project, commande } = await fetchAndValidateRelations(+collaborateur_id, +atelier_id, +project_id, +commande_id);

      rapport.collaborateur = collaborateur;
      rapport.atelier = atelier;
      rapport.project = project;
      rapport.commande = commande;
      rapport.date = date;
      rapport.durée = +durée;
      rapport.coût = +coût;

      if (req.file) {
        rapport.filePath = `/uploads/${req.file.filename}`;
      }

      const result = await getRepository(RapportsActivités).save(rapport);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: 'Error updating rapport', error: (error as any).message });
    }
  }
);

router.delete('/:id', async (req, res) => {
  try {
    const rapport = await getRepository(RapportsActivités).findOne({ where: { rapport_id: +req.params.id } });

    if (!rapport) {
      return res.status(404).json({ message: 'Rapport not found' });
    }

    // Optionally delete the file if it exists
    if (rapport.filePath) {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(rapport.filePath));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const result = await getRepository(RapportsActivités).delete(+req.params.id);
    res.json({ message: 'Rapport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting rapport', error: (error as any).message });
  }
});

export default router;

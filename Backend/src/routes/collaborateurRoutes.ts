import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { Collaborateurs } from '../entity/Collaborateurs';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/', async (req, res) => {
  const collaborateurs = await getRepository(Collaborateurs).find();
  res.json(collaborateurs);
});

router.get('/:id', async (req, res) => {
  const collaborateur = await getRepository(Collaborateurs).findOne({ where: { collaborateur_id: req.params.id } } as unknown as FindOneOptions<Collaborateurs>);
  if (collaborateur) {
    res.json(collaborateur);
  } else {
    res.status(404).json({ message: 'Collaborateur not found' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { mot_de_passe, ...otherData } = req.body;
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const collaborateur = getRepository(Collaborateurs).create({ ...otherData, mot_de_passe: hashedPassword });
    const result = await getRepository(Collaborateurs).save(collaborateur);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du collaborateur', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const collaborateur = await getRepository(Collaborateurs).findOne({ where: { collaborateur_id: req.params.id } } as unknown as FindOneOptions<Collaborateurs>);
    if (collaborateur) {
      const { mot_de_passe, ...otherData } = req.body;
      if (mot_de_passe) {
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        req.body.mot_de_passe = hashedPassword;
      }
      getRepository(Collaborateurs).merge(collaborateur, req.body);
      const result = await getRepository(Collaborateurs).save(collaborateur);
      res.json(result);
    } else {
      res.status(404).json({ message: 'Collaborateur not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du collaborateur', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await getRepository(Collaborateurs).delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du collaborateur', error });
  }
});

export default router;

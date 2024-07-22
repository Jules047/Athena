// src/routes/atelierRoutes.ts
import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { Atelier } from '../entity/Atelier';
import { Collaborateurs } from '../entity/Collaborateurs';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const ateliers = await getRepository(Atelier).find({ relations: ['collaborateur'] });
    res.json(ateliers);
  } catch (error: any) {
    console.error('Error fetching ateliers:', error);
    res.status(500).json({ message: 'Error fetching ateliers', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const atelier = await getRepository(Atelier).findOneOrFail({
      where: { atelier_id: Number(req.params.id) },
      relations: ['collaborateur']
    } as FindOneOptions<Atelier>);
    res.json(atelier);
  } catch (error: any) {
    if (error instanceof Error && error.name === 'EntityNotFound') {
      res.status(404).json({ message: 'Atelier not found' });
    } else {
      console.error('Error fetching atelier:', error);
      res.status(500).json({ message: 'Error fetching atelier', error: error.message });
    }
  }
});

router.post('/', async (req, res) => {
  try {
    const { collaborateur_id, ...atelierData } = req.body;
    const atelierRepository = getRepository(Atelier);
    const collaborateur = await getRepository(Collaborateurs).findOne({ where: { collaborateur_id } });

    if (!collaborateur) {
      return res.status(400).json({ message: 'Collaborateur not found' });
    }

    const atelier = atelierRepository.create({ ...atelierData, collaborateur });
    const result = await atelierRepository.save(atelier);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating atelier:', error);
    res.status(500).json({ message: 'Error creating atelier', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { collaborateur_id, ...atelierData } = req.body;
    const atelierRepository = getRepository(Atelier);
    const atelier = await atelierRepository.findOneOrFail({
      where: { atelier_id: Number(req.params.id) },
      relations: ['collaborateur']
    } as FindOneOptions<Atelier>);

    const collaborateur = await getRepository(Collaborateurs).findOne({ where: { collaborateur_id } });

    if (!collaborateur) {
      return res.status(400).json({ message: 'Collaborateur not found' });
    }

    atelierRepository.merge(atelier, { ...atelierData, collaborateur });
    const result = await atelierRepository.save(atelier);
    res.json(result);
  } catch (error: any) {
    console.error('Error updating atelier:', error);
    res.status(500).json({ message: 'Error updating atelier', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await getRepository(Atelier).delete(req.params.id);
    if (result.affected) {
      res.json({ message: 'Atelier deleted successfully' });
    } else {
      res.status(404).json({ message: 'Atelier not found' });
    }
  } catch (error: any) {
    console.error('Error deleting atelier:', error);
    res.status(500).json({ message: 'Error deleting atelier', error: error.message });
  }
});

export default router;

import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { Commandes } from '../entity/Commandes';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const commandes = await getRepository(Commandes).find();
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commandes', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const commande = await getRepository(Commandes).findOne({ where: { commande_id: req.params.id } } as unknown as FindOneOptions<Commandes>);
    if (commande) {
      res.json(commande);
    } else {
      res.status(404).json({ message: 'Commande not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commande', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const commande = getRepository(Commandes).create(req.body);
    const result = await getRepository(Commandes).save(commande);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating commande', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const commande = await getRepository(Commandes).findOne({ where: { commande_id: req.params.id } } as unknown as FindOneOptions<Commandes>);
    if (commande) {
      getRepository(Commandes).merge(commande, req.body);
      const result = await getRepository(Commandes).save(commande);
      res.json(result);
    } else {
      res.status(404).json({ message: 'Commande not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating commande', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await getRepository(Commandes).delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting commande', error });
  }
});

export default router;

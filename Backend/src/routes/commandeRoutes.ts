import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { Commandes } from '../entity/Commandes';

const router = Router();

router.get('/', async (req, res) => {
  const commandes = await getRepository(Commandes).find();
  res.json(commandes);
});

router.get('/:id', async (req, res) => {
  const commande = await getRepository(Commandes).findOne({ where: { commande_id: req.params.id } } as unknown as FindOneOptions<Commandes>);
  if (commande) {
    res.json(commande);
  } else {
    res.status(404).json({ message: 'Commande not found' });
  }
});

router.post('/', async (req, res) => {
  const commande = getRepository(Commandes).create(req.body);
  const result = await getRepository(Commandes).save(commande);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const commande = await getRepository(Commandes).findOne({ where: { commande_id: req.params.id } } as unknown as FindOneOptions<Commandes>);
  if (commande) {
    getRepository(Commandes).merge(commande, req.body);
    const result = await getRepository(Commandes).save(commande);
    res.json(result);
  } else {
    res.status(404).json({ message: 'Commande not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await getRepository(Commandes).delete(req.params.id);
  res.json(result);
});

export default router;

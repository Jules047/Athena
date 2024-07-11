import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { Statistiques } from '../entity/Statistiques';

const router = Router();

router.get('/', async (req, res) => {
  const stats = await getRepository(Statistiques).find({ relations: ["utilisateur"] });
  res.json(stats);
});

router.get('/:id', async (req, res) => {
  const stat = await getRepository(Statistiques).findOne({ where: { stat_id: req.params.id }, relations: ["utilisateur"] } as unknown as FindOneOptions<Statistiques>);
  if (stat) {
    res.json(stat);
  } else {
    res.status(404).json({ message: 'Statistic not found' });
  }
});

router.post('/', async (req, res) => {
  const stat = getRepository(Statistiques).create(req.body);
  const result = await getRepository(Statistiques).save(stat);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const stat = await getRepository(Statistiques).findOne({ where: { stat_id: req.params.id } } as unknown as FindOneOptions<Statistiques>);
  if (stat) {
    getRepository(Statistiques).merge(stat, req.body);
    const result = await getRepository(Statistiques).save(stat);
    res.json(result);
  } else {
    res.status(404).json({ message: 'Statistic not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await getRepository(Statistiques).delete(req.params.id);
  res.json(result);
});

export default router;

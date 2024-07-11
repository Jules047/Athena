import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { RapportsActivités } from '../entity/RapportsActivités';

const router = Router();

router.get('/', async (req, res) => {
  const rapports = await getRepository(RapportsActivités).find({ relations: ["utilisateur", "commande"] });
  res.json(rapports);
});

router.get('/:id', async (req, res) => {
  const rapport = await getRepository(RapportsActivités).findOne({ where: { rapport_id: req.params.id }, relations: ["utilisateur", "commande"] } as unknown as FindOneOptions<RapportsActivités>);
  if (rapport) {
    res.json(rapport);
  } else {
    res.status(404).json({ message: 'Rapport not found' });
  }
});

router.post('/', async (req, res) => {
  const rapport = getRepository(RapportsActivités).create(req.body);
  const result = await getRepository(RapportsActivités).save(rapport);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const rapport = await getRepository(RapportsActivités).findOne({ where: { rapport_id: req.params.id } } as unknown as FindOneOptions<RapportsActivités>);
  if (rapport) {
    getRepository(RapportsActivités).merge(rapport, req.body);
    const result = await getRepository(RapportsActivités).save(rapport);
    res.json(result);
  } else {
    res.status(404).json({ message: 'Rapport not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await getRepository(RapportsActivités).delete(req.params.id);
  res.json(result);
});

export default router;

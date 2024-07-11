import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { Administrateurs } from '../entity/Administrateurs';

const router = Router();

router.get('/', async (req, res) => {
  const admins = await getRepository(Administrateurs).find();
  res.json(admins);
});

router.get('/:id', async (req, res) => {
  const admin = await getRepository(Administrateurs).findOne({ where: { id: req.params.id } } as FindOneOptions<Administrateurs>) as Administrateurs;
  if (admin) {
    res.json(admin);
  } else {
    res.status(404).json({ message: 'Admin not found' });
  }
});

router.post('/', async (req, res) => {
  const admin = getRepository(Administrateurs).create(req.body);
  const result = await getRepository(Administrateurs).save(admin);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const admin = await getRepository(Administrateurs).findOne({  where: { id: req.params.id } } as FindOneOptions<Administrateurs>);
  if (admin) {
    getRepository(Administrateurs).merge(admin, req.body);
    const result = await getRepository(Administrateurs).save(admin);
    res.json(result);
  } else {
    res.status(404).json({ message: 'Admin not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await getRepository(Administrateurs).delete(req.params.id);
  res.json(result);
});

export default router;

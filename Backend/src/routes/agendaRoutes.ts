import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { Agenda } from '../entity/Agenda';

const router = Router();

router.get('/', async (req, res) => {
  const agendas = await getRepository(Agenda).find({ relations: ["utilisateur"] });
  res.json(agendas);
});

router.get('/:id', async (req, res) => {
  const agenda = await getRepository(Agenda).findOne({ where: { agenda_id: req.params.id }, relations: ["utilisateur"] } as unknown as FindOneOptions<Agenda>);
  if (agenda) {
    res.json(agenda);
  } else {
    res.status(404).json({ message: 'Agenda not found' });
  }
});

router.post('/', async (req, res) => {
  const agenda = getRepository(Agenda).create(req.body);
  const result = await getRepository(Agenda).save(agenda);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const agenda = await getRepository(Agenda).findOne({ where: { agenda_id: req.params.id } } as unknown as FindOneOptions<Agenda>);
  if (agenda) {
    getRepository(Agenda).merge(agenda, req.body);
    const result = await getRepository(Agenda).save(agenda);
    res.json(result);
  } else {
    res.status(404).json({ message: 'Agenda not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await getRepository(Agenda).delete(req.params.id);
  res.json(result);
});

export default router;

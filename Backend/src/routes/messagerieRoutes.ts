import { Router } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { MessagerieInterne } from '../entity/MessagerieInterne';

const router = Router();

router.get('/', async (req, res) => {
  const messages = await getRepository(MessagerieInterne).find({ relations: ["expéditeur", "destinataire"] });
  res.json(messages);
});

router.get('/:id', async (req, res) => {
  const message = await getRepository(MessagerieInterne).findOne({ where: { message_id: req.params.id }, relations: ["expéditeur", "destinataire"] } as unknown as FindOneOptions<MessagerieInterne>);
  if (message) {
    res.json(message);
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});

router.post('/', async (req, res) => {
  const message = getRepository(MessagerieInterne).create(req.body);
  const result = await getRepository(MessagerieInterne).save(message);
  res.status(201).json(result);
});

router.put('/:id', async (req, res) => {
  const message = await getRepository(MessagerieInterne).findOne({ where: { message_id: req.params.id } } as unknown as FindOneOptions<MessagerieInterne>);
  if (message) {
    getRepository(MessagerieInterne).merge(message, req.body);
    const result = await getRepository(MessagerieInterne).save(message);
    res.json(result);
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const result = await getRepository(MessagerieInterne).delete(req.params.id);
  res.json(result);
});

export default router;

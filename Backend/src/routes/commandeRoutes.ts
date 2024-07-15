import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Commandes } from '../entity/Commandes';

const router = Router();

// Get all Commandes
router.get('/', async (req, res) => {
  try {
    const commandes = await getRepository(Commandes).find();
    res.json(commandes);
<<<<<<< HEAD
  } catch (error: any) {
    console.error('Error fetching commandes:', error);
    res.status(500).json({ message: 'Error fetching commandes', error: error.message });
=======
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commandes', error });
>>>>>>> origin/master
  }
});

// Get a specific Commande by ID
router.get('/:id', async (req, res) => {
  try {
<<<<<<< HEAD
    const commande = await getRepository(Commandes).findOne({ where: { commande_id: Number(req.params.id) } });
=======
    const commande = await getRepository(Commandes).findOne({ where: { commande_id: req.params.id } } as unknown as FindOneOptions<Commandes>);
>>>>>>> origin/master
    if (commande) {
      res.json(commande);
    } else {
      res.status(404).json({ message: 'Commande not found' });
    }
<<<<<<< HEAD
  } catch (error: any) {
    console.error('Error fetching commande:', error);
    res.status(500).json({ message: 'Error fetching commande', error: error.message });
=======
  } catch (error) {
    res.status(500).json({ message: 'Error fetching commande', error });
>>>>>>> origin/master
  }
});

// Create a new Commande
router.post('/', async (req, res) => {
  try {
    const commande = getRepository(Commandes).create(req.body);
    const result = await getRepository(Commandes).save(commande);
    res.status(201).json(result);
<<<<<<< HEAD
  } catch (error: any) {
    console.error('Error creating commande:', error);
    res.status(500).json({ message: 'Error creating commande', error: error.message });
=======
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
>>>>>>> origin/master
  }
});

// Update a specific Commande by ID
router.put('/:id', async (req, res) => {
  try {
    const commandeRepository = getRepository(Commandes);
    const commande = await commandeRepository.findOne({ where: { commande_id: Number(req.params.id) } });
    if (commande) {
      commandeRepository.merge(commande, req.body);
      const result = await commandeRepository.save(commande);
      res.json(result);
    } else {
      res.status(404).json({ message: 'Commande not found' });
    }
  } catch (error: any) {
    console.error('Error updating commande:', error);
    res.status(500).json({ message: 'Error updating commande', error: error.message });
  }
});

// Delete a specific Commande by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await getRepository(Commandes).delete(req.params.id);
<<<<<<< HEAD
    if (result.affected) {
      res.json({ message: 'Commande deleted successfully' });
    } else {
      res.status(404).json({ message: 'Commande not found' });
    }
  } catch (error: any) {
    console.error('Error deleting commande:', error);
    res.status(500).json({ message: 'Error deleting commande', error: error.message });
=======
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting commande', error });
>>>>>>> origin/master
  }
});

export default router;

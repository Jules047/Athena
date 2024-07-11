import { Router } from 'express';
import { getRepository } from 'typeorm';
import { OrdreDeFabrication } from '../entity/OrdreDeFabrication';
import { Utilisateurs } from '../entity/Utilisateurs';

const router = Router();

// Récupérer tous les ordres de fabrication
router.get('/', async (req, res) => {
  try {
    const orders = await getRepository(OrdreDeFabrication).find({ relations: ['cree_par', 'mis_a_jour_par'] });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Récupérer un ordre de fabrication par ID
router.get('/:id', async (req, res) => {
  try {
    const order = await getRepository(OrdreDeFabrication).findOneOrFail({ where: { of_id: Number(req.params.id) }, relations: ['cree_par', 'mis_a_jour_par'] });
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

// Créer un nouvel ordre de fabrication
router.post('/', async (req, res) => {
  try {
    const { nom_affaire, description, plans, annotations, plans_fournisseurs, details_poseurs, cree_par } = req.body;
    const userRepository = getRepository(Utilisateurs);
    const user = await userRepository.findOneOrFail(cree_par);

    const order = new OrdreDeFabrication();
    order.nom_affaire = nom_affaire;
    order.description = description;
    order.plans = plans;
    order.annotations = annotations;
    order.plans_fournisseurs = plans_fournisseurs;
    order.details_poseurs = details_poseurs;
    order.cree_par = user;

    await getRepository(OrdreDeFabrication).save(order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Mettre à jour un ordre de fabrication
router.put('/:id', async (req, res) => {
  try {
    const orderRepository = getRepository(OrdreDeFabrication);
    const order = await orderRepository.findOneOrFail({ where: { of_id: Number(req.params.id) } });
    const { cree_par } = req.body;

    if (cree_par) {
      const userRepository = getRepository(Utilisateurs);
      const user = await userRepository.findOneOrFail(cree_par);
      req.body.cree_par = user;
    }

    orderRepository.merge(order, req.body);
    await orderRepository.save(order);
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// Supprimer un ordre de fabrication
router.delete('/:id', async (req, res) => {
  try {
    const result = await getRepository(OrdreDeFabrication).delete(req.params.id);
    if (result.affected) {
      res.json({ message: 'Ordre de fabrication supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Ordre de fabrication non trouvé' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order', error });
  }
});

export default router;

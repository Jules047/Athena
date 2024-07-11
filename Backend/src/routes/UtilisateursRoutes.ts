import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Utilisateurs } from '../entity/Utilisateurs';
import bcrypt from 'bcryptjs';

const router = Router();

// Create
router.post('/', async (req, res) => {
  const userRepository = getRepository(Utilisateurs);
  const { prenom, nom, qualification, droits_acces, mot_de_passe, role } = req.body;
  
  const user = new Utilisateurs();
  user.prenom = prenom;
  user.nom = nom;
  user.qualification = qualification;
  user.droits_acces = droits_acces;
  user.mot_de_passe = bcrypt.hashSync(mot_de_passe, 10);
  user.role = role;

  await userRepository.save(user);
  res.json(user);
});

// Read all
router.get('/', async (req, res) => {
  const userRepository = getRepository(Utilisateurs);
  const users = await userRepository.find();
  res.json(users);
});

// Read one
router.get('/:id', async (req, res) => {
  const userRepository = getRepository(Utilisateurs);
  const user = await userRepository.findOne({ where: { utilisateur_id: parseInt(req.params.id) } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Update
router.put('/:id', async (req, res) => {
  const userRepository = getRepository(Utilisateurs);
  const user = await userRepository.findOne({ where: { utilisateur_id: parseInt(req.params.id) } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { prenom, nom, qualification, droits_acces, mot_de_passe, role } = req.body;
  user.prenom = prenom;
  user.nom = nom;
  user.qualification = qualification;
  user.droits_acces = droits_acces;
  if (mot_de_passe) {
    user.mot_de_passe = bcrypt.hashSync(mot_de_passe, 10);
  }
  user.role = role;

  await userRepository.save(user);
  res.json(user);
});

// Delete
router.delete('/:id', async (req, res) => {
  const userRepository = getRepository(Utilisateurs);
  const user = await userRepository.findOne({ where: { utilisateur_id: parseInt(req.params.id) } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  await userRepository.remove(user);
  res.json({ message: 'User deleted' });
});

export default router;

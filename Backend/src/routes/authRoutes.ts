import { Router } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Utilisateurs } from '../entity/Utilisateurs';

const router = Router();

// Enregistrement
router.post('/register', async (req, res) => {
  const { prenom, nom, qualification, droits_acces, mot_de_passe, role } = req.body;
  const userRepository = getRepository(Utilisateurs);

  try {
    const existingUser = await userRepository.findOne({ where: { prenom } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new Utilisateurs();
    user.prenom = prenom;
    user.nom = nom;
    user.qualification = qualification;
    user.droits_acces = droits_acces;
    user.mot_de_passe = bcrypt.hashSync(mot_de_passe, 10);
    user.role = role;

    await userRepository.save(user);
    res.status(201).json({ message: 'Utilisateur enregistré avec succès!' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
  const { prenom } = req.body;
  const userRepository = getRepository(Utilisateurs);

  try {
    const user = await userRepository.findOne({ where: { prenom } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    user.mot_de_passe = bcrypt.hashSync(newPassword, 10);

    await userRepository.save(user);
    res.json({ newPassword });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { prenom, mot_de_passe } = req.body;
  const userRepository = getRepository(Utilisateurs);

  try {
    // Vérifiez si les champs prenom et mot_de_passe sont fournis
    if (!prenom || !mot_de_passe) {
      return res.status(400).json({ message: 'Prenom and mot_de_passe are required' });
    }

    const user = await userRepository.findOne({ where: { prenom } });
    if (!user || !user.mot_de_passe) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Vérifiez si user.mot_de_passe est défini avant de l'utiliser
    const isPasswordValid = bcrypt.compareSync(mot_de_passe, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.utilisateur_id, prenom: user.prenom, role: user.role },
      process.env.JWT_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDEsInByZW5vbSI6InNzc3MiLCJyb2xlIjoiQ2xpZW50IiwiaWF0IjoxNzIxMzk4MTczLCJleHAiOjE3MjE0MDE3NzN9.woQ46oKNDRt1q_Y-349fZ5Fbe13YJ7lAS5NaEZ2Yqz8',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

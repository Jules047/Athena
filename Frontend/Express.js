import express from 'express';
import { getRepository } from 'typeorm';
import { Utilisateurs } from '../entity/Utilisateurs';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const userRepository = getRepository(Utilisateurs);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Générez un lien de réinitialisation de mot de passe (vous pouvez utiliser un token JWT ou un autre mécanisme)
  const resetLink = `http://localhost:3000/reset-password?token=your-generated-token`;

  // Configurez Nodemailer pour envoyer l'email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Password Reset',
    text: `Click the link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email' });
    }
    res.status(200).json({ message: 'Password reset email sent successfully' });
  });
});

export default router;

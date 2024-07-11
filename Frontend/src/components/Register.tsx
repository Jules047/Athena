import React, { useState, ChangeEvent, FormEvent } from 'react';
import api from '../api';
import './Register.css'; // Importer les styles CSS
import { Link, useNavigate } from 'react-router-dom';

interface FormData {
  prenom: string;
  nom: string;
  qualification: string;
  droits_acces: string;
  mot_de_passe: string;
  role: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    nom: '',
    qualification: '',
    droits_acces: '',
    mot_de_passe: '',
    role: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', formData);
      setMessage('Utilisateur enregistré avec succès!');
      setError(null);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirige après 2 secondes
    } catch (error) {
      setMessage(null);
      setError('Error registering user');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <h2>Register</h2>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label htmlFor="prenom">Prénom</label>
              <input type="text" name="prenom" id="prenom" onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label htmlFor="nom">Nom</label>
              <input type="text" name="nom" id="nom" onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label htmlFor="qualification">Qualification</label>
              <input type="text" name="qualification" id="qualification" onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label htmlFor="droits_acces">Droits d'accès</label>
              <input type="text" name="droits_acces" id="droits_acces" onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label htmlFor="mot_de_passe">Mot de passe</label>
              <input type="password" name="mot_de_passe" id="mot_de_passe" onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label htmlFor="role">Role</label>
              <input type="text" name="role" id="role" onChange={handleChange} required />
            </div>
            <div className="button-container">
              <button type="submit">Register</button>
              <Link to="/login" className="sign-in-button">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
      <div className="auth-image">
        {/* Ajouter votre image ici */}
      </div>
    </div>
  );
};

export default Register;

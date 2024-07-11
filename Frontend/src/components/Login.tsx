import React, { useState, ChangeEvent, FormEvent } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

interface FormData {
  prenom: string;
  mot_de_passe: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ prenom: '', mot_de_passe: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      setMessage('Logged in successfully!');
      setError(null);
      navigate('/dashboard'); // Remplacer par la page à laquelle rediriger après la connexion
    } catch (error) {
      setMessage(null);
      setError('Error logging in');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Se connecter</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="prenom">Prenom</label>
            <input type="text" name="prenom" id="prenom" placeholder="prenom" onChange={handleChange} />
          </div>
          <div className="input-container">
            <label htmlFor="mot_de_passe">Mot de passe</label>
            <input type="password" name="mot_de_passe" id="mot_de_passe" placeholder="Mot de passe" onChange={handleChange} />
          </div>
          <div className="forgot-password">
            <Link to="/forgot-password">Mot de passe oublier</Link>
          </div>
          <div className="button-container">
            <button type="submit">Connecter</button>
            <Link to="/register" className="sign-up-button">S'inscrire</Link>
          </div>
        </form>
      </div>
      <div className="login-image">
        {/* Ajouter votre image ici */}
      </div>
    </div>
  );
};

export default Login;

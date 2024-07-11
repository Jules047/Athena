import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [prenom, setPrenom] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrenom(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/reset-password', { prenom });
      setMessage(`New password is: ${response.data.newPassword}`);
      setError(null);
    } catch (error) {
      setMessage(null);
      setError('Error resetting password');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="prenom">Prenom</label>
            <input type="text" name="prenom" id="prenom" onChange={handleChange} required />
          </div>
          <div className="button-container">
            <button type="submit">Reset Password</button>
          </div>
          <div className="return-to-login">
            <Link to="/login">Return to login</Link>
          </div>
        </form>
      </div>
      <div className="forgot-password-image">
        <h1>Vous avez oublié votre mot de passe?</h1>
      </div>
    </div>
  );
};

export default ForgotPassword;

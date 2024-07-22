import React from 'react';
import loaderImage from '../assets/nolan.jpg'; // Assurez-vous que le chemin est correct
import bondyLogo from '../assets/depann.png'; // Assurez-vous que le chemin est correct
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999,
    backgroundColor: '#fff',
    flexDirection: 'column',
  }}>
    <img src={loaderImage} alt="Loading..." style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
    <div style={{ position: 'relative', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={bondyLogo} alt="Bondy Logo" style={{ width: '60px', height: '60px' }} />
      <CircularProgress style={{ marginTop: '16px', color: '#fff' }} />
      <p style={{ marginTop: '16px', fontSize: '20px', color: '#fff' }}>Chargement</p>
    </div>
  </div>
);

export default Loader;

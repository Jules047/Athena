import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Users from './Users';
import Statistics from './Statistics';
import Orders from './Orders';

const Administrators: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="users">Utilisateurs</Link></li>
          <li><Link to="statistics">Statistiques</Link></li>
          <li><Link to="orders">Commandes</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="users" element={<Users />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

export default Administrators;

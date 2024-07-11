import React, { useState, useEffect } from 'react';
import api from '../api';

interface User {
  utilisateur_id: number;
  prenom: string;
  nom: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/Utilisateurs');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.utilisateur_id}>{user.prenom} {user.nom}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;

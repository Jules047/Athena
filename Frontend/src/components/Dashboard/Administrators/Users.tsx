import React, { useState, useEffect } from 'react';
import api from '../../../api';
import './Users.css';

interface User {
  utilisateur_id: number;
  prenom: string;
  nom: string;
  qualification?: string;
  droits_acces?: string;
  mot_de_passe: string;
  role?: string;
  isActive: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/utilisateurs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched users:', response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user: User) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
  };

  const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, role: e.target.value });
    }
  };

  const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, isActive: e.target.checked });
    }
  };

  const handleSave = async () => {
    if (selectedUser) {
      try {
        const token = localStorage.getItem('token');
        await api.put(`/utilisateurs/${selectedUser.utilisateur_id}`, selectedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.map(user => (user.utilisateur_id === selectedUser.utilisateur_id ? selectedUser : user)));
        alert('User updated successfully');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div>
      <h2>Gestion des Utilisateurs</h2>
      <ul className="users-list">
        {users.map(user => (
          <li key={user.utilisateur_id} onClick={() => handleSelectUser(user)}>
            {user.prenom} {user.nom} ({user.role})
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div className="user-form">
          <h3>Modifier l'utilisateur</h3>
          <form>
            <label>
              Rôle:
              <select value={selectedUser.role} onChange={handleChangeRole}>
                <option value="direction">Direction</option>
                <option value="Bet">BET</option>
                <option value="Collaborateur">Collaborateur</option>
                <option value="Client">Client</option>
              </select>
            </label>
            <label>
              Actif:
              <input
                type="checkbox"
                checked={selectedUser.isActive}
                onChange={handleChangeActive}
              />
            </label>
            <button type="button" onClick={handleSave}>
              Enregistrer
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;

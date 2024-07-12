import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField,
  Button, Select, MenuItem, FormControl, InputLabel,
  SelectChangeEvent
} from '@mui/material';
import axios from 'axios';

interface CommandeFormProps {
  fetchCommandes: () => void;
  handleClose: () => void;
  open: boolean;
  initialData: Partial<Commande>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setAlertType: React.Dispatch<React.SetStateAction<'success' | 'error'>>;
}

interface Commande {
  commande_id: number;
  nom: string;
  description?: string;
  type?: string;
  estimation?: number;
}

const CommandeForm: React.FC<CommandeFormProps> = ({
  fetchCommandes, handleClose, open, initialData, setAlertMessage, setAlertType
}) => {
  const [commande, setCommande] = useState<Partial<Commande>>(initialData);

  useEffect(() => {
    setCommande(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCommande(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (commande.commande_id) {
        await axios.put(`http://localhost:3000/commandes/${commande.commande_id}`, commande, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlertMessage('Commande mise à jour avec succès');
        setAlertType('success');
      } else {
        await axios.post('http://localhost:3000/commandes', commande, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlertMessage('Commande ajoutée avec succès');
        setAlertType('success');
      }
      fetchCommandes();
      handleClose();
    } catch (error) {
      setAlertMessage('Erreur lors de l\'ajout ou de la mise à jour de la commande');
      setAlertType('error');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{commande.commande_id ? 'Modifier Commande' : 'Ajouter Commande'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nom"
          name="nom"
          value={commande.nom || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={commande.description || ''}
          onChange={handleChange}
          fullWidth
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={commande.type || ''}
            onChange={handleChange}
          >
            <MenuItem value="Matières">Matières</MenuItem>
            <MenuItem value="Quincailleries">Quincailleries</MenuItem>
            <MenuItem value="Accessoires">Accessoires</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Estimation (AR)"
          name="estimation"
          type="number"
          value={commande.estimation || ''}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {commande.commande_id ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommandeForm;

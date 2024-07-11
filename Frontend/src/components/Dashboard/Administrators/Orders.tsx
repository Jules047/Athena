import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert, Select, MenuItem,
  InputLabel, FormControl, SelectChangeEvent
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Commande {
  commande_id: number;
  nom_commande: string;
  client_id: number;
  statut_commande: string;
}

interface CommandeEstimation {
  type: string;
  description: string;
  estimation: number;
}

const taskTypes = [
  "Heure de découpe (HD)",
  "Heure d’usinage (HU)",
  "Heure de placage et de ponçage (HPP)",
  "Heure de travail sur la résine (HTR)",
  "Heure de montage atelier (HMA)",
  "Heure de nettoyage, emballage avant livraison (HNE)",
  "Heure de chargement et livraison (HCL)",
  "Heure bureau de méthodes (HB)",
  "Heure entretien Machines (HEM)",
  "Heure nettoyage Atelier (HNA)",
  "Heure de rangement Atelier (HRA)",
  "Heure de visite sur site client (HVSC)",
  "Heure de formation client (HFC)",
  "Heure de montage sur site client (HMSC)",
  "Heure de levée de réserves (HLR)",
  "Heure de GPA et de réception de travaux (HGPA-RT)"
];

const qualifications = [
  { value: 'T', label: 'Technicien', coefficient: 1.5 },
  { value: 'OS', label: 'Ouvrier Spécialisé', coefficient: 1.0 },
  { value: 'M', label: 'Manœuvre', coefficient: 0.8 }
];

const commandesEstimations: CommandeEstimation[] = [
  {
    type: 'Matières',
    description: 'Commande de matières premières nécessaires à la production',
    estimation: 5000,
  },
  {
    type: 'Quincailleries',
    description: 'Commande de quincailleries pour l’assemblage des produits',
    estimation: 2000,
  },
  {
    type: 'Accessoires',
    description: 'Commande d’accessoires supplémentaires pour les produits',
    estimation: 1500,
  },
];

const AtelierPage: React.FC = () => {
  const [ateliers, setAteliers] = useState<Commande[]>([]);
  const [newAtelier, setNewAtelier] = useState<Partial<Commande>>({});
  const [editingAtelier, setEditingAtelier] = useState<Commande | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [atelierToDelete, setAtelierToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAteliers();
  }, []);

  const fetchAteliers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/commandes');
      setAteliers(response.data);
    } catch (error) {
      console.error('Error fetching ateliers:', error);
      setAlertMessage('Error fetching ateliers');
      setAlertType('error');
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAtelier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewAtelier((prev) => ({ ...prev, [name!]: value }));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewAtelier({});
    setEditingAtelier(null);
  };

  const handleConfirmDialogOpen = (commande_id: number) => {
    setAtelierToDelete(commande_id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setAtelierToDelete(null);
  };

  const addOrUpdateAtelier = async () => {
    try {
      if (!newAtelier.nom_commande || !newAtelier.client_id || !newAtelier.statut_commande) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      const updatedAtelier = { ...newAtelier, coût: 0 }; // Adjust this to your logic

      if (editingAtelier) {
        await axios.put(`http://localhost:3000/commandes/${editingAtelier.commande_id}`, updatedAtelier);
        setAteliers(ateliers.map((atelier) =>
          atelier.commande_id === editingAtelier.commande_id ? { ...atelier, ...updatedAtelier } : atelier
        ));
        setEditingAtelier(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await axios.post('http://localhost:3000/commandes', updatedAtelier);
        setAteliers([...ateliers, response.data]);
        setAlertMessage('Nouvel atelier ajouté');
        setAlertType('success');
      }
      setNewAtelier({});
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding/updating atelier:', error);
      if (axios.isAxiosError(error)) {
        setAlertMessage(`Error adding/updating atelier: ${error.response?.data || error.message}`);
      } else {
        setAlertMessage('Unexpected error');
      }
      setAlertType('error');
    }
  };

  const editAtelier = (atelier: Commande) => {
    setNewAtelier({
      nom_commande: atelier.nom_commande,
      client_id: atelier.client_id,
      statut_commande: atelier.statut_commande
    });
    setEditingAtelier(atelier);
    setDialogOpen(true);
  };

  const deleteAtelier = async () => {
    try {
      if (atelierToDelete === null) return;
      await axios.delete(`http://localhost:3000/commandes/${atelierToDelete}`);
      setAteliers(ateliers.filter(atelier => atelier.commande_id !== atelierToDelete));
      setAlertMessage('Atelier deleted successfully');
      setAlertType('success');
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Error deleting atelier:', error);
      setAlertMessage('Error deleting atelier');
      setAlertType('error');
    }
  };

  return (
    <div>
      <Typography variant="h6">Liste des commandes</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom de la commande</TableCell>
              <TableCell>Client ID</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ateliers.map((atelier) => (
              <TableRow key={atelier.commande_id}>
                <TableCell>{atelier.nom_commande}</TableCell>
                <TableCell>{atelier.client_id}</TableCell>
                <TableCell>{atelier.statut_commande}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editAtelier(atelier)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(atelier.commande_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab color="primary" aria-label="add" onClick={handleDialogOpen} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Add />
      </Fab>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingAtelier ? 'Modifier Commande' : 'Ajouter Commande'}</DialogTitle>
        <DialogContent>
          <TextField label="Nom de la commande" name="nom_commande" value={newAtelier.nom_commande || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Client ID" name="client_id" type="number" value={newAtelier.client_id || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Statut" name="statut_commande" value={newAtelier.statut_commande || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Annuler</Button>
          <Button onClick={addOrUpdateAtelier} color="primary">{editingAtelier ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet atelier ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">Annuler</Button>
          <Button onClick={deleteAtelier} color="primary">Supprimer</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertMessage !== null}
        autoHideDuration={6000}
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlertMessage(null)} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Typography variant="h6" style={{ marginTop: 20 }}>Chiffrage estimatif des commandes</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type de Commande</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Estimation (€)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commandesEstimations.map((commande, index) => (
              <TableRow key={index}>
                <TableCell>{commande.type}</TableCell>
                <TableCell>{commande.description}</TableCell>
                <TableCell>{commande.estimation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AtelierPage />
  );
};

export default App;

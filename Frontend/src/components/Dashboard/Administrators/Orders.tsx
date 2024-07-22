import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Fab, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import CommandeForm from './CommandeForm';

interface Commande {
  commande_id: number;
  nom: string;
  description?: string;
  type?: string;
  estimation?: number;
}

const CommandesList: React.FC = () => {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentCommande, setCurrentCommande] = useState<Partial<Commande> | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [commandeToDelete, setCommandeToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/commandes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommandes(response.data);
    } catch (error) {
      setAlertMessage('Error fetching commandes');
      setAlertType('error');
    }
  };

  const handleEdit = (commande: Commande) => {
    setCurrentCommande(commande);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    try {
      if (commandeToDelete === null) return;
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/commandes/${commandeToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommandes(commandes.filter((commande) => commande.commande_id !== commandeToDelete));
      setAlertMessage('Commande deleted successfully');
      setAlertType('success');
      setConfirmDialogOpen(false);
      setCommandeToDelete(null);
    } catch (error) {
      setAlertMessage('Error deleting commande');
      setAlertType('error');
    }
  };

  const handleOpenForm = () => {
    setCurrentCommande(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleConfirmDialogOpen = (id: number) => {
    setCommandeToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setCommandeToDelete(null);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Liste des commandes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Estimation (AR)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commandes.map((commande) => (
              <TableRow key={commande.commande_id}>
                <TableCell>{commande.nom}</TableCell>
                <TableCell>{commande.description}</TableCell>
                <TableCell>{commande.type}</TableCell>
                <TableCell>{commande.estimation}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(commande)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(commande.commande_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab color="primary" aria-label="add" onClick={handleOpenForm} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Add />
      </Fab>
      {openForm && (
        <CommandeForm
          fetchCommandes={fetchCommandes}
          handleClose={handleCloseForm}
          open={openForm}
          initialData={currentCommande || {}}
          setAlertMessage={setAlertMessage}
          setAlertType={setAlertType}
        />
      )}
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
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cette commande ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="primary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommandesList;

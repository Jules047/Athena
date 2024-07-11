import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Collaborator {
  collaborateur_id: number;
  nom: string;
  prenom: string;
  qualification?: string;
  droits_acces?: string;
  mot_de_passe: string;
}

const CollaboratorPanel: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newCollaborator, setNewCollaborator] = useState<Partial<Collaborator>>({});
  const [editingCollaborator, setEditingCollaborator] = useState<Partial<Collaborator> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [collaboratorToDelete, setCollaboratorToDelete] = useState<Collaborator | null>(null);

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/collaborateurs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollaborators(response.data);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      setAlertMessage('Error fetching collaborators');
      setAlertType('error');
    }
  };

  const handleCollaboratorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewCollaborator((prev) => ({ ...prev, [name]: value }));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewCollaborator({});
    setEditingCollaborator(null);
  };

  const addOrUpdateCollaborator = async () => {
    try {
      if (!newCollaborator.nom || !newCollaborator.prenom || !newCollaborator.mot_de_passe) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }
      const token = localStorage.getItem('token');
      if (editingCollaborator) {
        await axios.put(`http://localhost:3000/collaborateurs/${editingCollaborator.collaborateur_id}`, newCollaborator, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCollaborators(collaborators.map((collab) =>
          collab.collaborateur_id === editingCollaborator.collaborateur_id ? { ...collab, ...newCollaborator } : collab
        ));
        setEditingCollaborator(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await axios.post('http://localhost:3000/collaborateurs', newCollaborator, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCollaborators([...collaborators, response.data]);
        setAlertMessage('Nouveau collaborateur ajouté');
        setAlertType('success');
      }
      setNewCollaborator({});
      setDialogOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertMessage(`Error adding/updating collaborator: ${error.response?.data || error.message}`);
      } else {
        setAlertMessage('Unexpected error');
      }
      setAlertType('error');
    }
  };

  const editCollaborator = (collaborator: Collaborator) => {
    setNewCollaborator(collaborator);
    setEditingCollaborator(collaborator);
    setDialogOpen(true);
  };

  const deleteCollaborator = async (collaborateur_id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/collaborateurs/${collaborateur_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollaborators(collaborators.filter(collab => collab.collaborateur_id !== collaborateur_id));
      setAlertMessage('Collaborateur supprimer avec succès');
      setAlertType('success');
      setConfirmDialogOpen(false);
      setCollaboratorToDelete(null);
    } catch (error) {
      console.error('Error deleting collaborator:', error);
      setAlertMessage('Error deleting collaborator');
      setAlertType('error');
    }
  };

  const handleDeleteConfirmation = (collaborator: Collaborator) => {
    setCollaboratorToDelete(collaborator);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setCollaboratorToDelete(null);
  };

  return (
    <div>
      <Typography variant="h6">Liste des collaborateurs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Accès Web</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collaborators.map((collaborator) => (
              <TableRow key={collaborator.collaborateur_id}>
                <TableCell>{collaborator.nom}</TableCell>
                <TableCell>{collaborator.prenom}</TableCell>
                <TableCell>{collaborator.qualification}</TableCell>
                <TableCell>{collaborator.droits_acces}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editCollaborator(collaborator)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteConfirmation(collaborator)}>
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
        <DialogTitle>{editingCollaborator ? 'Modifier Collaborateur' : 'Ajouter Collaborateur'}</DialogTitle>
        <DialogContent>
          <TextField label="Nom" name="nom" value={newCollaborator.nom || ''} onChange={handleCollaboratorChange} fullWidth margin="normal" />
          <TextField label="Prénom" name="prenom" value={newCollaborator.prenom || ''} onChange={handleCollaboratorChange} fullWidth margin="normal" />
          <FormControl fullWidth margin="normal">
            <InputLabel>Qualification</InputLabel>
            <Select name="qualification" value={newCollaborator.qualification || ''} onChange={handleCollaboratorChange}>
              <MenuItem value="T">Technicien</MenuItem>
              <MenuItem value="OS">Ouvrier Spécialisé</MenuItem>
              <MenuItem value="M">Manœuvre</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Accès Web" name="droits_acces" value={newCollaborator.droits_acces || ''} onChange={handleCollaboratorChange} fullWidth margin="normal" />
          <TextField label="Mot de passe" type="password" name="mot_de_passe" value={newCollaborator.mot_de_passe || ''} onChange={handleCollaboratorChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Annuler</Button>
          <Button onClick={addOrUpdateCollaborator} color="primary">{editingCollaborator ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce collaborateur ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">Annuler</Button>
          <Button onClick={() => deleteCollaborator(collaboratorToDelete?.collaborateur_id!)} color="primary">Supprimer</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertMessage !== null}
        autoHideDuration={6000}
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: 64, alignItems: 'center' }} // Custom styling for central position
      >
        <Alert onClose={() => setAlertMessage(null)} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CollaboratorPanel;

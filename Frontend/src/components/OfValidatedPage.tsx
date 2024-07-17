import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, MenuItem } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../api';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  filePath: string;
  cree_le: string;
}

interface Utilisateurs {
  utilisateur_id: number;
  prenom: string;
  nom: string;
}

interface OfValidated {
  of_id: number;
  project: Project;
  created_by: Utilisateurs;
  approved_by: Utilisateurs;
  approved_at: string;
}

const OfValidatedPage: React.FC = () => {
  const [ofValidateds, setOfValidateds] = useState<OfValidated[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<Utilisateurs[]>([]);
  const [newOfValidated, setNewOfValidated] = useState<Partial<OfValidated>>({});
  const [editingOfValidated, setEditingOfValidated] = useState<OfValidated | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [ofValidatedToDelete, setOfValidatedToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchOfValidateds();
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchOfValidateds = async () => {
    try {
      const response = await api.get('/ofvalidated');
      setOfValidateds(response.data);
    } catch (error) {
      console.error('Error fetching ofValidateds:', error);
      setAlertMessage('Error fetching ofValidateds');
      setAlertType('error');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setAlertMessage('Error fetching projects');
      setAlertType('error');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/utilisateurs');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAlertMessage('Error fetching users');
      setAlertType('error');
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOfValidated((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewOfValidated((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewOfValidated({});
    setEditingOfValidated(null);
  };

  const handleConfirmDialogOpen = (id: number) => {
    setOfValidatedToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setOfValidatedToDelete(null);
  };

  const addOrUpdateOfValidated = async () => {
    try {
      if (!newOfValidated.project || !newOfValidated.created_by) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      const updatedOfValidated = { ...newOfValidated };

      if (editingOfValidated) {
        await api.put(`/ofvalidated/${editingOfValidated.of_id}`, updatedOfValidated);
        setOfValidateds(ofValidateds.map((ofValidated) =>
          ofValidated.of_id === editingOfValidated.of_id ? { ...ofValidated, ...updatedOfValidated } : ofValidated
        ));
        setEditingOfValidated(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await api.post('/ofvalidated', updatedOfValidated);
        setOfValidateds([...ofValidateds, response.data]);
        setAlertMessage('Nouveau ofValidated ajouté');
        setAlertType('success');
      }
      setNewOfValidated({});
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding/updating ofValidated:', error);
      if (axios.isAxiosError(error)) {
        setAlertMessage(`Error adding/updating ofValidated: ${error.response?.data || error.message}`);
      } else {
        setAlertMessage('Unexpected error');
      }
      setAlertType('error');
    }
  };

  const editOfValidated = (ofValidated: OfValidated) => {
    setNewOfValidated({
      project: ofValidated.project,
      created_by: ofValidated.created_by,
      approved_by: ofValidated.approved_by,
      approved_at: ofValidated.approved_at
    });
    setEditingOfValidated(ofValidated);
    setDialogOpen(true);
  };

  const deleteOfValidated = async () => {
    try {
      if (ofValidatedToDelete === null) return;
      await api.delete(`/ofvalidated/${ofValidatedToDelete}`);
      setOfValidateds(ofValidateds.filter(ofValidated => ofValidated.of_id !== ofValidatedToDelete));
      setAlertMessage('OfValidated deleted successfully');
      setAlertType('success');
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Error deleting ofValidated:', error);
      setAlertMessage('Error deleting ofValidated');
      setAlertType('error');
    }
  };

  return (
    <div>
      <Typography variant="h6">Liste des OF Validated</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Approved By</TableCell>
              <TableCell>Approved At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ofValidateds.map((ofValidated) => (
              <TableRow key={ofValidated.of_id}>
                <TableCell>{ofValidated.project.name}</TableCell>
                <TableCell>{`${ofValidated.created_by.prenom} ${ofValidated.created_by.nom}`}</TableCell>
                <TableCell>{ofValidated.approved_by ? `${ofValidated.approved_by.prenom} ${ofValidated.approved_by.nom}` : 'N/A'}</TableCell>
                <TableCell>{ofValidated.approved_at}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editOfValidated(ofValidated)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(ofValidated.of_id)}>
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
        <DialogTitle>{editingOfValidated ? 'Modifier OF Validated' : 'Ajouter OF Validated'}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Project"
            name="project"
            value={newOfValidated.project || ''}
            onChange={handleSelectChange}
            fullWidth
            margin="normal"
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Created By"
            name="created_by"
            value={newOfValidated.created_by || ''}
            onChange={handleSelectChange}
            fullWidth
            margin="normal"
          >
            {users.map((user) => (
              <MenuItem key={user.utilisateur_id} value={user.utilisateur_id}>
                {user.prenom} {user.nom}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Approved By"
            name="approved_by"
            value={newOfValidated.approved_by || ''}
            onChange={handleSelectChange}
            fullWidth
            margin="normal"
          >
            {users.map((user) => (
              <MenuItem key={user.utilisateur_id} value={user.utilisateur_id}>
                {user.prenom} {user.nom}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Approved At"
            name="approved_at"
            type="date"
            value={newOfValidated.approved_at || ''}
            onChange={handleTextFieldChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Annuler</Button>
          <Button onClick={addOrUpdateOfValidated} color="primary">{editingOfValidated ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce OF Validated ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">Annuler</Button>
          <Button onClick={deleteOfValidated} color="primary">Supprimer</Button>
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
    </div>
  );
};

export default OfValidatedPage;

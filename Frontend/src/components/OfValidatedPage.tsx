import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface OfValidated {
  id: number;
  project: string;
  createdBy: string;
  approvedBy: string;
  approvedAt: string;
}

const OfValidatedPage: React.FC = () => {
  const [ofValidateds, setOfValidateds] = useState<OfValidated[]>([]);
  const [newOfValidated, setNewOfValidated] = useState<Partial<OfValidated>>({});
  const [editingOfValidated, setEditingOfValidated] = useState<OfValidated | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [ofValidatedToDelete, setOfValidatedToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchOfValidateds();
  }, []);

  const fetchOfValidateds = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ofvalidated');
      setOfValidateds(response.data);
    } catch (error) {
      console.error('Error fetching ofValidateds:', error);
      setAlertMessage('Error fetching ofValidateds');
      setAlertType('error');
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOfValidated((prev) => ({ ...prev, [name]: value }));
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
      if (!newOfValidated.project || !newOfValidated.createdBy) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      const updatedOfValidated = { ...newOfValidated };

      if (editingOfValidated) {
        await axios.put(`http://localhost:3000/ofvalidated/${editingOfValidated.id}`, updatedOfValidated);
        setOfValidateds(ofValidateds.map((ofValidated) =>
          ofValidated.id === editingOfValidated.id ? { ...ofValidated, ...updatedOfValidated } : ofValidated
        ));
        setEditingOfValidated(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await axios.post('http://localhost:3000/ofvalidated', updatedOfValidated);
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
      createdBy: ofValidated.createdBy,
      approvedBy: ofValidated.approvedBy,
      approvedAt: ofValidated.approvedAt
    });
    setEditingOfValidated(ofValidated);
    setDialogOpen(true);
  };

  const deleteOfValidated = async () => {
    try {
      if (ofValidatedToDelete === null) return;
      await axios.delete(`http://localhost:3000/ofvalidated/${ofValidatedToDelete}`);
      setOfValidateds(ofValidateds.filter(ofValidated => ofValidated.id !== ofValidatedToDelete));
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
              <TableCell>Project</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Approved By</TableCell>
              <TableCell>Approved At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ofValidateds.map((ofValidated) => (
              <TableRow key={ofValidated.id}>
                <TableCell>{ofValidated.project}</TableCell>
                <TableCell>{ofValidated.createdBy}</TableCell>
                <TableCell>{ofValidated.approvedBy}</TableCell>
                <TableCell>{ofValidated.approvedAt}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editOfValidated(ofValidated)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(ofValidated.id)}>
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
          <TextField label="Project" name="project" value={newOfValidated.project || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Created By" name="createdBy" value={newOfValidated.createdBy || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Approved By" name="approvedBy" value={newOfValidated.approvedBy || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Approved At" name="approvedAt" value={newOfValidated.approvedAt || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
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

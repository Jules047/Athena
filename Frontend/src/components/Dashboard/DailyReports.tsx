import React, { useEffect, useState } from 'react';
import api, { getCollaborateurs, getAteliers, getProjects, getCommandes } from '../services/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Fab, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, Snackbar, Alert, FormControl,
  InputLabel, SelectChangeEvent
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { format } from 'date-fns';

interface Collaborateur {
  collaborateur_id: number;
  prenom: string;
  nom: string;
  qualification: string;
  cree_le: string;
  modifie_le: string;
}

interface Atelier {
  atelier_id: number;
  type_tâche: string;
  taux_horaire: number;
  qualification: string;
  coût: number;
  heures_travail: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  cree_le: string;
}

interface Commande {
  commande_id: number;
  nom: string;
  description: string;
  type: string;
  estimation: number;
  cree_le: string;
  modifie_le: string;
}

interface Rapport {
  rapport_id: number;
  collaborateur: Collaborateur;
  atelier: Atelier;
  project: Project;
  commande: Commande;
  date: string;
  durée: number;
  coût: number;
}

const ReportPage: React.FC = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [newRapport, setNewRapport] = useState<Partial<Rapport>>({});
  const [editingRapport, setEditingRapport] = useState<Rapport | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rapportToDelete, setRapportToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rapportsResponse, collaborateursResponse, ateliersResponse, projectsResponse, commandesResponse] = await Promise.all([
          api.get('/rapports'),
          getCollaborateurs(),
          getAteliers(),
          getProjects(),
          getCommandes()
        ]);

        setRapports(rapportsResponse.data.map((rapport: Rapport) => ({
          ...rapport,
          date: format(new Date(rapport.date), 'yyyy-MM-dd')
        })));
        setCollaborateurs(collaborateursResponse.data);
        setAteliers(ateliersResponse.data);
        setProjects(projectsResponse.data);
        setCommandes(commandesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlertMessage('Error fetching data');
        setAlertType('error');
      }
    };

    fetchData();
  }, []);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRapport(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setNewRapport(prev => ({
      ...prev,
      [name]: {
        collaborateur_id: name === 'collaborateur' ? value : prev.collaborateur?.collaborateur_id,
        atelier_id: name === 'atelier' ? value : prev.atelier?.atelier_id,
        id: name === 'project' ? value : prev.project?.id,
        commande_id: name === 'commande' ? value : prev.commande?.commande_id,
      }
    }));
  };

  const handleDialogOpen = () => {
    if (!editingRapport) {
      const today = new Date();
      setNewRapport(prev => ({ ...prev, date: format(today, 'yyyy-MM-dd') }));
    } else if (editingRapport) {
      setNewRapport({
        ...editingRapport,
        date: format(new Date(editingRapport.date), 'yyyy-MM-dd')
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewRapport({});
    setEditingRapport(null);
  };

  const handleConfirmDialogOpen = (id: number) => {
    setRapportToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setRapportToDelete(null);
  };

  const addRapport = async () => {
    try {
      if (!newRapport.durée || !newRapport.coût || !newRapport.date) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      const formattedDate = format(new Date(newRapport.date as string), 'yyyy-MM-dd');
      const response = await api.post('/rapports', { ...newRapport, date: formattedDate });
      setRapports([...rapports, response.data]);
      setAlertMessage('Nouveau rapport ajouté');
      setAlertType('success');
      setNewRapport({});
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding rapport:', error);
      setAlertMessage('Error adding rapport');
      setAlertType('error');
    }
  };

  const updateRapport = async () => {
    try {
      if (!newRapport.durée || !newRapport.coût || !newRapport.date || !editingRapport) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      const formattedDate = format(new Date(newRapport.date as string), 'yyyy-MM-dd');
      const response = await api.put(`/rapports/${editingRapport.rapport_id}`, {
        ...newRapport,
        date: formattedDate
      });

      setRapports(rapports.map(rapport =>
        rapport.rapport_id === editingRapport.rapport_id ? { ...rapport, ...newRapport, date: formattedDate } : rapport
      ));
      setEditingRapport(null);
      setAlertMessage('Modification réussie');
      setAlertType('success');
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && error.response) {
        const axiosError = error as { response: { data: { errors: Array<{ path: string; msg: string }> } } };
        const errorMessage = axiosError.response.data.errors.map((e) => `${e.path}: ${e.msg}`).join(', ');
        console.error('Error updating rapport:', axiosError.response.data);
        setAlertMessage(`Error updating rapport: ${errorMessage}`);
      } else {
        console.error('Error updating rapport:', error);
        setAlertMessage('Error updating rapport');
      }
      setAlertType('error');
    }
  };
  
  

  const addOrUpdateRapport = () => {
    if (editingRapport) {
      updateRapport();
    } else {
      addRapport();
    }
  };

  const editRapport = (rapport: Rapport) => {
    setNewRapport({
      collaborateur: rapport.collaborateur,
      atelier: rapport.atelier,
      project: rapport.project,
      commande: rapport.commande,
      date: format(new Date(rapport.date), 'yyyy-MM-dd'),
      durée: rapport.durée,
      coût: rapport.coût,
    });
    setEditingRapport(rapport);
    setDialogOpen(true);
  };

  const deleteRapport = async () => {
    try {
      if (rapportToDelete === null) return;
      await api.delete(`/rapports/${rapportToDelete}`);
      setRapports(rapports.filter(rapport => rapport.rapport_id !== rapportToDelete));
      setAlertMessage('Rapport supprimé avec succès');
      setAlertType('success');
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Error deleting rapport:', error);
      setAlertMessage('Error deleting rapport');
      setAlertType('error');
    }
  };

  return (
    <div>
      <Typography variant="h4">Rapports</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Collaborateur</TableCell>
              <TableCell>Atelier</TableCell>
              <TableCell>Projet</TableCell>
              <TableCell>Commande</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Coût</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rapports.map((rapport) => (
              <TableRow key={rapport.rapport_id}>
                <TableCell>{rapport.collaborateur.prenom} {rapport.collaborateur.nom}</TableCell>
                <TableCell>{rapport.atelier.type_tâche}</TableCell>
                <TableCell>{rapport.project.name}</TableCell>
                <TableCell>{rapport.commande.nom}</TableCell>
                <TableCell>{format(new Date(rapport.date), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{rapport.durée}</TableCell>
                <TableCell>{rapport.coût}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editRapport(rapport)}><Edit /></IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(rapport.rapport_id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab color="primary" aria-label="add" onClick={handleDialogOpen}>
        <Add />
      </Fab>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingRapport ? 'Modifier Rapport' : 'Ajouter Rapport'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Collaborateur</InputLabel>
            <Select
              value={newRapport.collaborateur?.collaborateur_id || ''}
              onChange={handleSelectChange}
              name="collaborateur"
              label="Collaborateur"
            >
              {collaborateurs.map(collaborateur => (
                <MenuItem key={collaborateur.collaborateur_id} value={collaborateur.collaborateur_id}>
                  {collaborateur.prenom} {collaborateur.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Atelier</InputLabel>
            <Select
              value={newRapport.atelier?.atelier_id || ''}
              onChange={handleSelectChange}
              name="atelier"
              label="Atelier"
            >
              {ateliers.map(atelier => (
                <MenuItem key={atelier.atelier_id} value={atelier.atelier_id}>
                  {atelier.type_tâche}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Projet</InputLabel>
            <Select
              value={newRapport.project?.id || ''}
              onChange={handleSelectChange}
              name="project"
              label="Projet"
            >
              {projects.map(project => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Commande</InputLabel>
            <Select
              value={newRapport.commande?.commande_id || ''}
              onChange={handleSelectChange}
              name="commande"
              label="Commande"
            >
              {commandes.map(commande => (
                <MenuItem key={commande.commande_id} value={commande.commande_id}>
                  {commande.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            name="date"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newRapport.date || ''}
            onChange={handleTextFieldChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="durée"
            label="Durée"
            type="number"
            value={newRapport.durée || ''}
            onChange={handleTextFieldChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="coût"
            label="Coût"
            type="number"
            value={newRapport.coût || ''}
            onChange={handleTextFieldChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button onClick={addOrUpdateRapport}>{editingRapport ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmer la Suppression</DialogTitle>
        <DialogContent>Êtes-vous sûr de vouloir supprimer ce rapport ?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Annuler</Button>
          <Button onClick={deleteRapport} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={() => setAlertMessage(null)}
      >
        <Alert onClose={() => setAlertMessage(null)} severity={alertType}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ReportPage;

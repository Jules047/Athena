import React, { useEffect, useState } from 'react';
import api, { getCollaborateurs, getAteliers, getProjects, getCommandes } from './services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Fab, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem, Snackbar, Alert, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { format } from 'date-fns'; // Import the format function

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
    fetchRapports();
    fetchCollaborateurs();
    fetchAteliers();
    fetchProjects();
    fetchCommandes();
  }, []);

  const fetchRapports = async () => {
    try {
      const response = await api.get('/rapports');
      setRapports(response.data.map((rapport: Rapport) => ({
        ...rapport,
        date: format(new Date(rapport.date), 'dd/MM/yyyy') // Format date
      })));
      console.log('Rapports:', response.data);
    } catch (error) {
      console.error('Error fetching rapports:', error);
      setAlertMessage('Error fetching rapports');
      setAlertType('error');
    }
  };

  const fetchCollaborateurs = async () => {
    try {
      const response = await getCollaborateurs();
      setCollaborateurs(response.data);
      console.log('Collaborateurs:', response.data);
    } catch (error) {
      console.error('Error fetching collaborateurs:', error);
    }
  };

  const fetchAteliers = async () => {
    try {
      const response = await getAteliers();
      setAteliers(response.data);
      console.log('Ateliers:', response.data);
    } catch (error) {
      console.error('Error fetching ateliers:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
      console.log('Projects:', response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchCommandes = async () => {
    try {
      const response = await getCommandes();
      setCommandes(response.data);
      console.log('Commandes:', response.data);
    } catch (error) {
      console.error('Error fetching commandes:', error);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRapport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setNewRapport((prev) => ({
      ...prev,
      [name]: {
        collaborateur_id: name === 'collaborateur' ? value : newRapport.collaborateur?.collaborateur_id,
        atelier_id: name === 'atelier' ? value : newRapport.atelier?.atelier_id,
        id: name === 'project' ? value : newRapport.project?.id,
        commande_id: name === 'commande' ? value : newRapport.commande?.commande_id,
      },
    }));
  };

  const handleDialogOpen = () => {
    if (!editingRapport) {
      // Set current date when adding a new rapport
      const today = new Date();
      setNewRapport(prev => ({ ...prev, date: format(today, 'dd/MM/yyyy') }));
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

  const addOrUpdateRapport = async () => {
    try {
      if (!newRapport.durée || !newRapport.coût) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      if (editingRapport) {
        await api.put(`/rapport/${editingRapport.rapport_id}`, newRapport);
        setRapports(rapports.map((rapport) =>
          rapport.rapport_id === editingRapport.rapport_id ? { ...rapport, ...newRapport } : rapport
        ));
        setEditingRapport(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await api.post('/rapport', newRapport);
        setRapports([...rapports, response.data]);
        setAlertMessage('Nouveau rapport ajouté');
        setAlertType('success');
      }
      setNewRapport({});
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding/updating rapport:', error);
      setAlertMessage('Error adding/updating rapport');
      setAlertType('error');
    }
  };

  const editRapport = (rapport: Rapport) => {
    setNewRapport({
      collaborateur: rapport.collaborateur,
      atelier: rapport.atelier,
      project: rapport.project,
      commande: rapport.commande,
      date: rapport.date,
      durée: rapport.durée,
      coût: rapport.coût,
    });
    setEditingRapport(rapport);
    setDialogOpen(true);
  };

  const deleteRapport = async () => {
    if (rapportToDelete === null) return;

    try {
      await api.delete(`/rapport/${rapportToDelete}`);
      setRapports(rapports.filter((rapport) => rapport.rapport_id !== rapportToDelete));
      setAlertMessage('Rapport supprimé');
      setAlertType('success');
    } catch (error) {
      console.error('Error deleting rapport:', error);
      setAlertMessage('Error deleting rapport');
      setAlertType('error');
    } finally {
      setConfirmDialogOpen(false);
      setRapportToDelete(null);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Liste des Rapports
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Collaborateur</TableCell>
              <TableCell>Atelier</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Commande</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Coût</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rapports.map((rapport) => (
              <TableRow key={rapport.rapport_id}>
                <TableCell>{rapport.date}</TableCell>
                <TableCell>{rapport.collaborateur.prenom} {rapport.collaborateur.nom}</TableCell>
                <TableCell>{rapport.atelier.type_tâche}</TableCell>
                <TableCell>{rapport.project.name}</TableCell>
                <TableCell>{rapport.commande.nom}</TableCell>
                <TableCell>{rapport.durée} heures</TableCell>
                <TableCell>{rapport.coût} €</TableCell>
                <TableCell>
                  <IconButton onClick={() => editRapport(rapport)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(rapport.rapport_id)}>
                    <Delete />
                  </IconButton>
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
            <InputLabel id="collaborateur-label">Collaborateur</InputLabel>
            <Select
              labelId="collaborateur-label"
              name="collaborateur_id"
              value={newRapport.collaborateur?.collaborateur_id || ''}
              onChange={handleSelectChange}
            >
              {collaborateurs.map((collaborateur) => (
                <MenuItem key={collaborateur.collaborateur_id} value={collaborateur.collaborateur_id}>
                  {collaborateur.prenom} {collaborateur.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="atelier-label">Atelier</InputLabel>
            <Select
              labelId="atelier-label"
              name="atelier_id"
              value={newRapport.atelier?.atelier_id || ''}
              onChange={handleSelectChange}
            >
              {ateliers.map((atelier) => (
                <MenuItem key={atelier.atelier_id} value={atelier.atelier_id}>
                  {atelier.type_tâche}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="project-label">Project</InputLabel>
            <Select
              labelId="project-label"
              name="project_id"
              value={newRapport.project?.id || ''}
              onChange={handleSelectChange}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="commande-label">Commande</InputLabel>
            <Select
              labelId="commande-label"
              name="commande_id"
              value={newRapport.commande?.commande_id || ''}
              onChange={handleSelectChange}
            >
              {commandes.map((commande) => (
                <MenuItem key={commande.commande_id} value={commande.commande_id}>
                  {commande.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Durée (heures)"
            name="durée"
            type="number"
            value={newRapport.durée || ''}
            onChange={handleTextFieldChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Coût (€)"
            name="coût"
            type="number"
            value={newRapport.coût || ''}
            onChange={handleTextFieldChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button onClick={addOrUpdateRapport} color="primary">
            {editingRapport ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce rapport ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Annuler</Button>
          <Button onClick={deleteRapport} color="primary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      {alertMessage && (
        <Snackbar
          open={!!alertMessage}
          autoHideDuration={6000}
          onClose={() => setAlertMessage(null)}
        >
          <Alert onClose={() => setAlertMessage(null)} severity={alertType}>
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default ReportPage;

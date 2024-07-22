import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Collaborateur {
  collaborateur_id: number;
  prenom: string;
  nom: string;
  qualification: string;
}

interface Atelier {
  atelier_id: number;
  type_tache: string;
  taux_horaire: number;
  qualification?: string;
  cout: number;
  heures_travail: number;
  collaborateur_id?: number;
  collaborateur?: Collaborateur;
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

const AtelierPage: React.FC = () => {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
  const [newAtelier, setNewAtelier] = useState<Partial<Atelier>>({});
  const [editingAtelier, setEditingAtelier] = useState<Atelier | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [atelierToDelete, setAtelierToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAteliers();
    fetchCollaborateurs();
  }, []);

  const fetchAteliers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/ateliers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAteliers(response.data);
    } catch (error) {
      console.error('Error fetching ateliers:', error);
      setAlertMessage('Erreur lors de la récupération des ateliers');
      setAlertType('error');
    }
  };

  const fetchCollaborateurs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/collaborateurs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollaborateurs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des collaborateurs:', error);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAtelier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    if (name === "collaborateur_id") {
      const collaborateur = collaborateurs.find(c => c.collaborateur_id === Number(value));
      setNewAtelier((prev) => ({
        ...prev,
        collaborateur_id: Number(value), // Assurez-vous que la valeur est un nombre
        qualification: collaborateur ? collaborateur.qualification : prev.qualification
      }));
    } else {
      setNewAtelier((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewAtelier({});
    setEditingAtelier(null);
  };

  const handleConfirmDialogOpen = (atelier_id: number) => {
    setAtelierToDelete(atelier_id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setAtelierToDelete(null);
  };

  const calculateCost = (tauxHoraire: number, qualification: string, heuresTravail: number) => {
    const qualificationDetail = qualifications.find(q => q.value === qualification);
    return qualificationDetail ? tauxHoraire * qualificationDetail.coefficient * heuresTravail : tauxHoraire * heuresTravail;
  };

  const addOrUpdateAtelier = async () => {
    try {
      if (!newAtelier.type_tache || !newAtelier.taux_horaire || !newAtelier.qualification || !newAtelier.heures_travail || !newAtelier.collaborateur_id) {
        setAlertMessage('Veuillez remplir tous les champs obligatoires');
        setAlertType('error');
        return;
      }

      const cost = calculateCost(newAtelier.taux_horaire as number, newAtelier.qualification as string, newAtelier.heures_travail as number);
      const updatedAtelier = { ...newAtelier, cout: cost };

      const token = localStorage.getItem('token');
      if (editingAtelier) {
        const response = await axios.put(`http://localhost:3000/ateliers/${editingAtelier.atelier_id}`, updatedAtelier, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updatedCollaborateur = collaborateurs.find(c => c.collaborateur_id === newAtelier.collaborateur_id);
        setAteliers(ateliers.map((atelier) =>
          atelier.atelier_id === editingAtelier.atelier_id ? { ...atelier, ...response.data, collaborateur: updatedCollaborateur } : atelier
        ));
        setEditingAtelier(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await axios.post('http://localhost:3000/ateliers', updatedAtelier, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newCollaborateur = collaborateurs.find(c => c.collaborateur_id === newAtelier.collaborateur_id);
        setAteliers([...ateliers, { ...response.data, collaborateur: newCollaborateur }]);
        setAlertMessage('Nouvel atelier ajouté');
        setAlertType('success');
      }
      setNewAtelier({});
      setDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout/mise à jour de l\'atelier:', error);
      if (axios.isAxiosError(error)) {
        setAlertMessage(`Erreur lors de l'ajout/mise à jour de l'atelier: ${error.response?.data || error.message}`);
      } else {
        setAlertMessage('Erreur inattendue');
      }
      setAlertType('error');
    }
  };

  const editAtelier = (atelier: Atelier) => {
    setNewAtelier({
      type_tache: atelier.type_tache,
      taux_horaire: atelier.taux_horaire,
      qualification: atelier.qualification,
      heures_travail: atelier.heures_travail,
      collaborateur_id: atelier.collaborateur_id,
      collaborateur: atelier.collaborateur
    });
    setEditingAtelier(atelier);
    setDialogOpen(true);
  };

  const deleteAtelier = async () => {
    try {
      if (atelierToDelete === null) return;
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/ateliers/${atelierToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAteliers(ateliers.filter(atelier => atelier.atelier_id !== atelierToDelete));
      setAlertMessage('Atelier supprimé avec succès');
      setAlertType('success');
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'atelier:', error);
      setAlertMessage('Erreur lors de la suppression de l\'atelier');
      setAlertType('error');
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Typography variant="h6">Liste des ateliers</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Collaborateur</TableCell>
              <TableCell>Type de tâche</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Taux horaire</TableCell>
              <TableCell>Heures de travail</TableCell>
              <TableCell>Coût</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ateliers.map((atelier) => (
              <TableRow key={atelier.atelier_id}>
                <TableCell>{atelier.collaborateur ? `${atelier.collaborateur.nom} ${atelier.collaborateur.prenom}` : 'N/A'}</TableCell>
                <TableCell>{atelier.type_tache}</TableCell>
                <TableCell>{atelier.qualification}</TableCell>
                <TableCell>{atelier.taux_horaire}</TableCell>
                <TableCell>{atelier.heures_travail}</TableCell>
                <TableCell>{atelier.cout} Ar</TableCell>
                <TableCell>
                  <IconButton onClick={() => editAtelier(atelier)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(atelier.atelier_id)}>
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
        <DialogTitle>{editingAtelier ? 'Modifier Atelier' : 'Ajouter Atelier'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Collaborateur</InputLabel>
            <Select
              name="collaborateur_id"
              value={newAtelier.collaborateur_id as number | "" | undefined}
              onChange={handleSelectChange}
            >
              {collaborateurs.map((collaborateur) => (
                <MenuItem key={collaborateur.collaborateur_id} value={collaborateur.collaborateur_id}>
                  {collaborateur.nom} {collaborateur.prenom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type de tâche</InputLabel>
            <Select
              name="type_tache"
              value={newAtelier.type_tache as number | "" | undefined}
              onChange={handleSelectChange}
              inputProps={{ inputMode: 'numeric' }}
            >
              {taskTypes.map((taskType, index) => (
                <MenuItem key={index} value={taskType}>{taskType}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Qualification</InputLabel>
            <Select
              name="qualification"
              value={newAtelier.qualification as number | "" | undefined}
              onChange={handleSelectChange}
            >
              {qualifications.map((qualification) => (
                <MenuItem key={qualification.value} value={qualification.value}>{qualification.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Taux horaire"
            name="taux_horaire"
            type="number"
            value={newAtelier.taux_horaire || ''}
            onChange={handleTextFieldChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Heures de travail"
            name="heures_travail"
            type="number"
            value={newAtelier.heures_travail || ''}
            onChange={handleTextFieldChange}
            fullWidth
            margin="normal"
          />
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
    </div>
  );
};

export default AtelierPage;

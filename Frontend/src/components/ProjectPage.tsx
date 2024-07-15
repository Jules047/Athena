import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
}

const ProjectPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Partial<Project>>({});
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setAlertMessage('Error fetching projects');
      setAlertType('error');
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewProject({});
    setEditingProject(null);
  };

  const handleConfirmDialogOpen = (id: number) => {
    setProjectToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setProjectToDelete(null);
  };

  const addOrUpdateProject = async () => {
    try {
      if (!newProject.name || !newProject.status) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      const updatedProject = { ...newProject };

      if (editingProject) {
        await axios.put(`http://localhost:3000/projects/${editingProject.id}`, updatedProject);
        setProjects(projects.map((proj) =>
          proj.id === editingProject.id ? { ...proj, ...updatedProject } : proj
        ));
        setEditingProject(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await axios.post('http://localhost:3000/projects', updatedProject);
        setProjects([...projects, response.data]);
        setAlertMessage('Nouveau projet ajouté');
        setAlertType('success');
      }
      setNewProject({});
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding/updating project:', error);
      if (axios.isAxiosError(error)) {
        setAlertMessage(`Error adding/updating project: ${error.response?.data || error.message}`);
      } else {
        setAlertMessage('Unexpected error');
      }
      setAlertType('error');
    }
  };

  const editProject = (project: Project) => {
    setNewProject({
      name: project.name,
      description: project.description,
      status: project.status
    });
    setEditingProject(project);
    setDialogOpen(true);
  };

  const deleteProject = async () => {
    try {
      if (projectToDelete === null) return;
      await axios.delete(`http://localhost:3000/projects/${projectToDelete}`);
      setProjects(projects.filter(proj => proj.id !== projectToDelete));
      setAlertMessage('Project deleted successfully');
      setAlertType('success');
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Error deleting project:', error);
      setAlertMessage('Error deleting project');
      setAlertType('error');
    }
  };

  return (
    <div>
      <Typography variant="h6">Liste des Projects</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editProject(project)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(project.id)}>
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
        <DialogTitle>{editingProject ? 'Modifier Project' : 'Ajouter Project'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={newProject.name || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Description" name="description" value={newProject.description || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Status" name="status" value={newProject.status || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Annuler</Button>
          <Button onClick={addOrUpdateProject} color="primary">{editingProject ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce projet ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">Annuler</Button>
          <Button onClick={deleteProject} color="primary">Supprimer</Button>
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

export default ProjectPage;
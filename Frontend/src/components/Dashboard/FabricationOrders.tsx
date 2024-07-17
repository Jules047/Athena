import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions,
  DialogContent, DialogTitle, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, Add, PictureAsPdf } from '@mui/icons-material';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  filePath: string;
  cree_le: string;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/projects');
      console.log('Fetched projects:', response.data); // Ajoutez ce log
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setAlertMessage('Error fetching projects');
      setAlertType('error');
    }
  };

  const formatDateString = (dateString: string) => {
    return moment(dateString).format('DD/MM/YYYY');
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewProject({});
    setSelectedFile(null);
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

      const formData = new FormData();
      formData.append('name', newProject.name as string);
      formData.append('description', newProject.description || '');
      formData.append('status', newProject.status as string);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      if (editingProject) {
        await axios.put(`http://localhost:3000/projects/${editingProject.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProjects(projects.map((proj) =>
          proj.id === editingProject.id ? { ...proj, ...newProject, cree_le: proj.cree_le } : proj
        ));
        setEditingProject(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await axios.post('http://localhost:3000/projects', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setProjects([...projects, response.data]);
        setAlertMessage('Nouveau projet ajouté');
        setAlertType('success');
      }
      setNewProject({});
      setSelectedFile(null);
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
      status: project.status,
      filePath: project.filePath
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
      <Typography variant="h6">Liste des Projets</Typography>
      {projects.length === 0 ? (
        <Typography variant="subtitle1">Aucun projet disponible</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>File Path</TableCell>
                <TableCell>Created At</TableCell>
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
                    <a href={`http://localhost:3000${project.filePath}`} download={`project_${project.id}.pdf`}>
                      <IconButton>
                        <PictureAsPdf />
                      </IconButton>
                    </a>
                  </TableCell>
                  <TableCell>{formatDateString(project.cree_le)}</TableCell>
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
      )}
      <Fab color="primary" aria-label="add" onClick={handleDialogOpen} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Add />
      </Fab>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editingProject ? 'Modifier Project' : 'Ajouter Project'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={newProject.name || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Description" name="description" value={newProject.description || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="Status" name="status" value={newProject.status || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <input type="file" onChange={handleFileChange} />
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

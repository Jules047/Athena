import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Fab, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Document {
  id: number;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  ofValidated: number;
}

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({});
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setAlertMessage('Error fetching documents');
      setAlertType('error');
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDocument((prev) => ({ ...prev, [name]: value }));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewDocument({});
    setEditingDocument(null);
  };

  const handleConfirmDialogOpen = (id: number) => {
    setDocumentToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setDocumentToDelete(null);
  };

  const addOrUpdateDocument = async () => {
    try {
      if (!newDocument.fileName || !newDocument.filePath || !newDocument.ofValidated) {
        setAlertMessage('Please fill in all required fields');
        setAlertType('error');
        return;
      }

      const updatedDocument = { ...newDocument };

      if (editingDocument) {
        await axios.put(`http://localhost:3000/documents/${editingDocument.id}`, updatedDocument);
        setDocuments(documents.map((doc) =>
          doc.id === editingDocument.id ? { ...doc, ...updatedDocument } : doc
        ));
        setEditingDocument(null);
        setAlertMessage('Modification réussie');
        setAlertType('success');
      } else {
        const response = await axios.post('http://localhost:3000/documents', updatedDocument);
        setDocuments([...documents, response.data]);
        setAlertMessage('Nouveau document ajouté');
        setAlertType('success');
      }
      setNewDocument({});
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding/updating document:', error);
      if (axios.isAxiosError(error)) {
        setAlertMessage(`Error adding/updating document: ${error.response?.data || error.message}`);
      } else {
        setAlertMessage('Unexpected error');
      }
      setAlertType('error');
    }
  };

  const editDocument = (document: Document) => {
    setNewDocument({
      fileName: document.fileName,
      filePath: document.filePath,
      ofValidated: document.ofValidated
    });
    setEditingDocument(document);
    setDialogOpen(true);
  };

  const deleteDocument = async () => {
    try {
      if (documentToDelete === null) return;
      await axios.delete(`http://localhost:3000/documents/${documentToDelete}`);
      setDocuments(documents.filter(doc => doc.id !== documentToDelete));
      setAlertMessage('Document deleted successfully');
      setAlertType('success');
      handleConfirmDialogClose();
    } catch (error) {
      console.error('Error deleting document:', error);
      setAlertMessage('Error deleting document');
      setAlertType('error');
    }
  };

  return (
    <div>
      <Typography variant="h6">Liste des Documents</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>File Path</TableCell>
              <TableCell>Uploaded At</TableCell>
              <TableCell>OF Validated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>{document.fileName}</TableCell>
                <TableCell>{document.filePath}</TableCell>
                <TableCell>{document.uploadedAt}</TableCell>
                <TableCell>{document.ofValidated}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editDocument(document)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleConfirmDialogOpen(document.id)}>
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
        <DialogTitle>{editingDocument ? 'Modifier Document' : 'Ajouter Document'}</DialogTitle>
        <DialogContent>
          <TextField label="File Name" name="fileName" value={newDocument.fileName || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="File Path" name="filePath" value={newDocument.filePath || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
          <TextField label="OF Validated" name="ofValidated" value={newDocument.ofValidated || ''} onChange={handleTextFieldChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Annuler</Button>
          <Button onClick={addOrUpdateDocument} color="primary">{editingDocument ? 'Modifier' : 'Ajouter'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer ce document ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="secondary">Annuler</Button>
          <Button onClick={deleteDocument} color="primary">Supprimer</Button>
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

export default DocumentPage;

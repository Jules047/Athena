import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Document } from '../entity/Document';

const router = Router();

// Create
router.post('/', async (req, res) => {
  const documentRepository = getRepository(Document);
  const { ofValidated, fileName, filePath } = req.body;

  const document = new Document();
  document.fileName = fileName;
  document.filePath = filePath;
  document.ofValidated = ofValidated;

  try {
    const result = await documentRepository.save(document);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating document:', error);
    res.status(500).json({ message: 'Error creating document', error: error.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  const documentRepository = getRepository(Document);
  try {
    const documents = await documentRepository.find();
    res.json(documents);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  const documentRepository = getRepository(Document);
  try {
    const document = await documentRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!document) return res.status(404).json({ message: 'Document not found' });
    res.json(document);
  } catch (error: any) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Error fetching document', error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const documentRepository = getRepository(Document);
  try {
    const document = await documentRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    const { fileName, filePath, ofValidated } = req.body;
    document.fileName = fileName;
    document.filePath = filePath;
    document.ofValidated = ofValidated;

    const result = await documentRepository.save(document);
    res.json(result);
  } catch (error: any) {
    console.error('Error updating document:', error);
    res.status(500).json({ message: 'Error updating document', error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  const documentRepository = getRepository(Document);
  try {
    const document = await documentRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    await documentRepository.remove(document);
    res.json({ message: 'Document deleted' });
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document', error: error.message });
  }
});

export default router;

import { Router } from 'express';
import { getRepository } from 'typeorm';
import { OfValidated } from '../entity/OfValidated';

const router = Router();

// Create
router.post('/', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  const { project, createdBy, approvedBy, approvedAt } = req.body;
  
  const ofValidated = new OfValidated();
  ofValidated.project = project;
  ofValidated.createdBy = createdBy;
  ofValidated.approvedBy = approvedBy;
  ofValidated.approvedAt = approvedAt;

  try {
    const result = await ofValidatedRepository.save(ofValidated);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating ofValidated:', error);
    res.status(500).json({ message: 'Error creating ofValidated', error: error.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidatedList = await ofValidatedRepository.find({ relations: ['project', 'createdBy', 'documents'] });
    res.json(ofValidatedList);
  } catch (error: any) {
    console.error('Error fetching ofValidated:', error);
    res.status(500).json({ message: 'Error fetching ofValidated', error: error.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidated = await ofValidatedRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['project', 'createdBy', 'documents'] });
    if (!ofValidated) return res.status(404).json({ message: 'OfValidated not found' });
    res.json(ofValidated);
  } catch (error: any) {
    console.error('Error fetching ofValidated:', error);
    res.status(500).json({ message: 'Error fetching ofValidated', error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidated = await ofValidatedRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!ofValidated) return res.status(404).json({ message: 'OfValidated not found' });

    const { project, createdBy, approvedBy, approvedAt } = req.body;
    ofValidated.project = project;
    ofValidated.createdBy = createdBy;
    ofValidated.approvedBy = approvedBy;
    ofValidated.approvedAt = approvedAt;

    const result = await ofValidatedRepository.save(ofValidated);
    res.json(result);
  } catch (error: any) {
    console.error('Error updating ofValidated:', error);
    res.status(500).json({ message: 'Error updating ofValidated', error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidated = await ofValidatedRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!ofValidated) return res.status(404).json({ message: 'OfValidated not found' });

    await ofValidatedRepository.remove(ofValidated);
    res.json({ message: 'OfValidated deleted' });
  } catch (error: any) {
    console.error('Error deleting ofValidated:', error);
    res.status(500).json({ message: 'Error deleting ofValidated', error: error.message });
  }
});

export default router;

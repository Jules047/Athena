import { Router } from 'express';
import { getRepository } from 'typeorm';
import { OfValidated } from '../entity/OfValidated';
import Project from '../entity/Project';
import { Utilisateurs } from '../entity/Utilisateurs';

const router = Router();

// Create
router.post('/', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  const { projectId, createdBy, approvedBy, approvedAt } = req.body;

  try {
    const project = await getRepository(Project).findOne(projectId);
    const createdByUser = await getRepository(Utilisateurs).findOne(createdBy);
    const approvedByUser = approvedBy ? await getRepository(Utilisateurs).findOne(approvedBy) : null;

    if (!project || !createdByUser) {
      return res.status(400).json({ message: 'Projet ou utilisateur créé par non trouvé' });
    }

    const ofValidated = new OfValidated();
    ofValidated.project = project;
    ofValidated.created_by = createdByUser as Utilisateurs;
    ofValidated.approved_by = approvedByUser as Utilisateurs || undefined;
    ofValidated.approved_at = approvedAt;

    const result = await ofValidatedRepository.save(ofValidated);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Erreur lors de la création de OfValidated:', error);
    res.status(500).json({ message: 'Erreur lors de la création de OfValidated', error: error.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidateds = await ofValidatedRepository.find({ relations: ['project', 'created_by', 'approved_by'] });
    res.json(ofValidateds);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des OfValidateds:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des OfValidateds', error: error.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidated = await ofValidatedRepository.findOne({
      where: { of_id: Number(req.params.id) },
      relations: ['project', 'created_by', 'approved_by']
    });
    if (!ofValidated) return res.status(404).json({ message: 'OfValidated non trouvé' });
    res.json(ofValidated);
  } catch (error: any) {
    console.error('Erreur lors de la récupération de OfValidated:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de OfValidated', error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidated = await ofValidatedRepository.findOne({
      where: { of_id: Number(req.params.id) },
      relations: ['project', 'created_by', 'approved_by']
    });
    if (!ofValidated) return res.status(404).json({ message: 'OfValidated non trouvé' });

    const { projectId, createdBy, approvedBy, approvedAt } = req.body;

    const project = await getRepository(Project).findOne({ where: { id: projectId } });
    const createdByUser = await getRepository(Utilisateurs).findOne({ where: { utilisateur_id: createdBy } });
    const approvedByUser = approvedBy ? await getRepository(Utilisateurs).findOne({ where: { utilisateur_id: approvedBy } }) : null;

    if (!project || !createdByUser) {
      return res.status(400).json({ message: 'Projet ou utilisateur créé par non trouvé' });
    }

    ofValidated.project = project;
    ofValidated.created_by = createdByUser;
    ofValidated.approved_by = approvedByUser || undefined;
    ofValidated.approved_at = approvedAt;

    const result = await ofValidatedRepository.save(ofValidated);
    res.json(result);
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de OfValidated:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de OfValidated', error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  const ofValidatedRepository = getRepository(OfValidated);
  try {
    const ofValidated = await ofValidatedRepository.findOne({
      where: { of_id: Number(req.params.id) }
    });
    if (!ofValidated) return res.status(404).json({ message: 'OfValidated non trouvé' });

    await ofValidatedRepository.remove(ofValidated);
    res.json({ message: 'OfValidated supprimé' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de OfValidated:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de OfValidated', error: error.message });
  }
});

export default router;

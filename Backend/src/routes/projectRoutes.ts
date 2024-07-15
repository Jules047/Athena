import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Project } from '../entity/Project';

const router = Router();

// Create
router.post('/', async (req, res) => {
  const projectRepository = getRepository(Project);
  const { name, description, status } = req.body;
  
  const project = new Project();
  project.name = name;
  project.description = description;
  project.status = status;

  try {
    const result = await projectRepository.save(project);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  const projectRepository = getRepository(Project);
  try {
    const projects = await projectRepository.find();
    res.json(projects);
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  const projectRepository = getRepository(Project);
  try {
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error: any) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  const projectRepository = getRepository(Project);
  try {
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { name, description, status } = req.body;
    project.name = name;
    project.description = description;
    project.status = status;

    const result = await projectRepository.save(project);
    res.json(result);
  } catch (error: any) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  const projectRepository = getRepository(Project);
  try {
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await projectRepository.remove(project);
    res.json({ message: 'Project deleted' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

export default router;

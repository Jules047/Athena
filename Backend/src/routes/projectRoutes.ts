import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Project } from '../entity/Project';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const router = Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Ensure the pdf directory exists
const pdfDir = path.join(__dirname, '../pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

// Helper function to generate PDF
const generatePDF = (project: Project, filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);
    doc.fontSize(25).text(`Project Name: ${project.name}`);
    doc.fontSize(20).text(`Description: ${project.description}`);
    doc.fontSize(20).text(`Status: ${project.status}`);
    doc.fontSize(15).text(`Created At: ${project.cree_le}`);
    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', (err) => reject(err));
  });
};

// Create
router.post('/', upload.single('file'), async (req, res) => {
  const projectRepository = getRepository(Project);
  const { name, description, status } = req.body;

  const project = new Project();
  project.name = name;
  project.description = description;
  project.status = status;

  try {
    const result = await projectRepository.save(project);

    const filePath = path.join(pdfDir, `project_${result.id}.pdf`);
    await generatePDF(result, filePath);
    result.filePath = `/pdfs/project_${result.id}.pdf`;

    await projectRepository.save(result);

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
router.put('/:id', upload.single('file'), async (req, res) => {
  const projectRepository = getRepository(Project);
  try {
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { name, description, status } = req.body;
    project.name = name;
    project.description = description;
    project.status = status;

    const result = await projectRepository.save(project);

    const filePath = path.join(pdfDir, `project_${result.id}.pdf`);
    await generatePDF(result, filePath);
    result.filePath = `/pdfs/project_${result.id}.pdf`;

    await projectRepository.save(result);

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

// Download PDF
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(pdfDir, filename);

  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

export default router;

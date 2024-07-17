import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Project } from '../entity/Project';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import PDFDocument from 'pdfkit';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
      console.log(`Created directory ${uploadPath}`);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log(`Created directory ${uploadsDir}`);
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
    const projectId = result.id;

    if (req.file) {
      const oldPath = path.join(uploadsDir, req.file.originalname);
      const newFilename = `project_${projectId}${path.extname(req.file.originalname)}`;
      const newPath = path.join(uploadsDir, newFilename);

      fs.renameSync(oldPath, newPath);
      console.log(`Renamed file to ${newFilename}`);
      
      result.filePath = `/uploads/${newFilename}`;
      await projectRepository.save(result);
    } else {
      const newFilename = `project_${projectId}.pdf`;
      const newPath = path.join(uploadsDir, newFilename);
      
      await generatePDF(project, newPath);
      console.log(`Generated PDF for project ${projectId}`);

      result.filePath = `/uploads/${newFilename}`;
      await projectRepository.save(result);
    }

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
    const projectId = result.id;

    if (req.file) {
      const oldPath = path.join(uploadsDir, req.file.originalname);
      const newFilename = `project_${projectId}${path.extname(req.file.originalname)}`;
      const newPath = path.join(uploadsDir, newFilename);

      fs.renameSync(oldPath, newPath);
      console.log(`Renamed file to ${newFilename}`);
      
      result.filePath = `/uploads/${newFilename}`;
      await projectRepository.save(result);
    } else if (!result.filePath) {
      const newFilename = `project_${projectId}.pdf`;
      const newPath = path.join(uploadsDir, newFilename);
      
      await generatePDF(project, newPath);
      console.log(`Generated PDF for project ${projectId}`);

      result.filePath = `/uploads/${newFilename}`;
      await projectRepository.save(result);
    }

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

    // Delete associated file if it exists
    if (project.filePath) {
      const filePath = path.join(__dirname, '..', project.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file at ${filePath}`);
      }
    }

    await projectRepository.remove(project);
    res.json({ message: 'Project deleted' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

// Serve static files from the "uploads" directory
import express from 'express';

router.use('/uploads', express.static(uploadsDir));

// Download file
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  console.log(`Request to download file at ${filePath}`);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.sendFile(filePath);
  } else {
    console.error(`File not found at ${filePath}`);
    res.status(404).send('File not found');
  }
});

export default router;

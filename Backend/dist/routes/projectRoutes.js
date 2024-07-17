"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Project_1 = require("../entity/Project");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '..', 'uploads');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath);
            console.log(`Created directory ${uploadPath}`);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// Ensure the uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
    console.log(`Created directory ${uploadsDir}`);
}
// Helper function to generate PDF
const generatePDF = (project, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default();
        const stream = fs_1.default.createWriteStream(filePath);
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
router.post('/', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const { name, description, status } = req.body;
    const project = new Project_1.Project();
    project.name = name;
    project.description = description;
    project.status = status;
    try {
        const result = yield projectRepository.save(project);
        const projectId = result.id;
        if (req.file) {
            const oldPath = path_1.default.join(uploadsDir, req.file.originalname);
            const newFilename = `project_${projectId}${path_1.default.extname(req.file.originalname)}`;
            const newPath = path_1.default.join(uploadsDir, newFilename);
            fs_1.default.renameSync(oldPath, newPath);
            console.log(`Renamed file to ${newFilename}`);
            result.filePath = `/uploads/${newFilename}`;
            yield projectRepository.save(result);
        }
        else {
            const newFilename = `project_${projectId}.pdf`;
            const newPath = path_1.default.join(uploadsDir, newFilename);
            yield generatePDF(project, newPath);
            console.log(`Generated PDF for project ${projectId}`);
            result.filePath = `/uploads/${newFilename}`;
            yield projectRepository.save(result);
        }
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    try {
        const projects = yield projectRepository.find();
        res.json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    try {
        const project = yield projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
}));
// Update
router.put('/:id', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    try {
        const project = yield projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        const { name, description, status } = req.body;
        project.name = name;
        project.description = description;
        project.status = status;
        const result = yield projectRepository.save(project);
        const projectId = result.id;
        if (req.file) {
            const oldPath = path_1.default.join(uploadsDir, req.file.originalname);
            const newFilename = `project_${projectId}${path_1.default.extname(req.file.originalname)}`;
            const newPath = path_1.default.join(uploadsDir, newFilename);
            fs_1.default.renameSync(oldPath, newPath);
            console.log(`Renamed file to ${newFilename}`);
            result.filePath = `/uploads/${newFilename}`;
            yield projectRepository.save(result);
        }
        else if (!result.filePath) {
            const newFilename = `project_${projectId}.pdf`;
            const newPath = path_1.default.join(uploadsDir, newFilename);
            yield generatePDF(project, newPath);
            console.log(`Generated PDF for project ${projectId}`);
            result.filePath = `/uploads/${newFilename}`;
            yield projectRepository.save(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    try {
        const project = yield projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        // Delete associated file if it exists
        if (project.filePath) {
            const filePath = path_1.default.join(__dirname, '..', project.filePath);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
                console.log(`Deleted file at ${filePath}`);
            }
        }
        yield projectRepository.remove(project);
        res.json({ message: 'Project deleted' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
}));
// Serve static files from the "uploads" directory
const express_2 = __importDefault(require("express"));
router.use('/uploads', express_2.default.static(uploadsDir));
// Download file
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(uploadsDir, filename);
    console.log(`Request to download file at ${filePath}`);
    if (fs_1.default.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.sendFile(filePath);
    }
    else {
        console.error(`File not found at ${filePath}`);
        res.status(404).send('File not found');
    }
});
exports.default = router;

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
const pdfkit_1 = __importDefault(require("pdfkit"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Configure multer for file uploads
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Ensure the pdf directory exists
const pdfDir = path_1.default.join(__dirname, '../pdfs');
if (!fs_1.default.existsSync(pdfDir)) {
    fs_1.default.mkdirSync(pdfDir);
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
        doc.fontSize(15).text(`Created At: ${project.cree_le}`);
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
        const filePath = path_1.default.join(pdfDir, `project_${result.id}.pdf`);
        yield generatePDF(result, filePath);
        result.filePath = `/pdfs/project_${result.id}.pdf`;
        yield projectRepository.save(result);
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
        const filePath = path_1.default.join(pdfDir, `project_${result.id}.pdf`);
        yield generatePDF(result, filePath);
        result.filePath = `/pdfs/project_${result.id}.pdf`;
        yield projectRepository.save(result);
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
        yield projectRepository.remove(project);
        res.json({ message: 'Project deleted' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
}));
// Download PDF
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(pdfDir, filename);
    if (fs_1.default.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.sendFile(filePath);
    }
    else {
        res.status(404).send('File not found');
    }
});
exports.default = router;

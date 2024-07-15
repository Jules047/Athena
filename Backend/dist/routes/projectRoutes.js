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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Project_1 = require("../entity/Project");
const router = (0, express_1.Router)();
// Create
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const { name, description, status } = req.body;
    const project = new Project_1.Project();
    project.name = name;
    project.description = description;
    project.status = status;
    try {
        const result = yield projectRepository.save(project);
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
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = router;

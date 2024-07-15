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
const Document_1 = require("../entity/Document");
const router = (0, express_1.Router)();
// Create
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentRepository = (0, typeorm_1.getRepository)(Document_1.Document);
    const { ofValidated, fileName, filePath } = req.body;
    const document = new Document_1.Document();
    document.fileName = fileName;
    document.filePath = filePath;
    document.ofValidated = ofValidated;
    try {
        const result = yield documentRepository.save(document);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ message: 'Error creating document', error: error.message });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentRepository = (0, typeorm_1.getRepository)(Document_1.Document);
    try {
        const documents = yield documentRepository.find();
        res.json(documents);
    }
    catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentRepository = (0, typeorm_1.getRepository)(Document_1.Document);
    try {
        const document = yield documentRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!document)
            return res.status(404).json({ message: 'Document not found' });
        res.json(document);
    }
    catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ message: 'Error fetching document', error: error.message });
    }
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentRepository = (0, typeorm_1.getRepository)(Document_1.Document);
    try {
        const document = yield documentRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!document)
            return res.status(404).json({ message: 'Document not found' });
        const { fileName, filePath, ofValidated } = req.body;
        document.fileName = fileName;
        document.filePath = filePath;
        document.ofValidated = ofValidated;
        const result = yield documentRepository.save(document);
        res.json(result);
    }
    catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Error updating document', error: error.message });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documentRepository = (0, typeorm_1.getRepository)(Document_1.Document);
    try {
        const document = yield documentRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!document)
            return res.status(404).json({ message: 'Document not found' });
        yield documentRepository.remove(document);
        res.json({ message: 'Document deleted' });
    }
    catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Error deleting document', error: error.message });
    }
}));
exports.default = router;

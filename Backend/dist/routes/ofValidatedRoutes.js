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
const OfValidated_1 = require("../entity/OfValidated");
const router = (0, express_1.Router)();
// Create
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    const { project, createdBy, approvedBy, approvedAt } = req.body;
    const ofValidated = new OfValidated_1.OfValidated();
    ofValidated.createdBy = createdBy;
    ofValidated.approvedBy = approvedBy;
    ofValidated.approvedAt = approvedAt;
    try {
        const result = yield ofValidatedRepository.save(ofValidated);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating ofValidated:', error);
        res.status(500).json({ message: 'Error creating ofValidated', error: error.message });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidatedList = yield ofValidatedRepository.find({ relations: ['project', 'createdBy', 'documents'] });
        res.json(ofValidatedList);
    }
    catch (error) {
        console.error('Error fetching ofValidated:', error);
        res.status(500).json({ message: 'Error fetching ofValidated', error: error.message });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidated = yield ofValidatedRepository.findOne({ where: { id: parseInt(req.params.id) }, relations: ['project', 'createdBy', 'documents'] });
        if (!ofValidated)
            return res.status(404).json({ message: 'OfValidated not found' });
        res.json(ofValidated);
    }
    catch (error) {
        console.error('Error fetching ofValidated:', error);
        res.status(500).json({ message: 'Error fetching ofValidated', error: error.message });
    }
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidated = yield ofValidatedRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!ofValidated)
            return res.status(404).json({ message: 'OfValidated not found' });
        const { project, createdBy, approvedBy, approvedAt } = req.body;
        ofValidated.createdBy = createdBy;
        ofValidated.approvedBy = approvedBy;
        ofValidated.approvedAt = approvedAt;
        const result = yield ofValidatedRepository.save(ofValidated);
        res.json(result);
    }
    catch (error) {
        console.error('Error updating ofValidated:', error);
        res.status(500).json({ message: 'Error updating ofValidated', error: error.message });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidated = yield ofValidatedRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!ofValidated)
            return res.status(404).json({ message: 'OfValidated not found' });
        yield ofValidatedRepository.remove(ofValidated);
        res.json({ message: 'OfValidated deleted' });
    }
    catch (error) {
        console.error('Error deleting ofValidated:', error);
        res.status(500).json({ message: 'Error deleting ofValidated', error: error.message });
    }
}));
exports.default = router;

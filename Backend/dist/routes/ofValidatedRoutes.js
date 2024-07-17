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
const OfValidated_1 = require("../entity/OfValidated");
const Project_1 = __importDefault(require("../entity/Project"));
const Utilisateurs_1 = require("../entity/Utilisateurs");
const router = (0, express_1.Router)();
// Create
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    const { projectId, createdBy, approvedBy, approvedAt } = req.body;
    try {
        const project = yield (0, typeorm_1.getRepository)(Project_1.default).findOne(projectId);
        const createdByUser = yield (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs).findOne(createdBy);
        const approvedByUser = approvedBy ? yield (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs).findOne(approvedBy) : null;
        if (!project || !createdByUser) {
            return res.status(400).json({ message: 'Projet ou utilisateur créé par non trouvé' });
        }
        const ofValidated = new OfValidated_1.OfValidated();
        ofValidated.project = project;
        ofValidated.created_by = createdByUser;
        ofValidated.approved_by = approvedByUser || undefined;
        ofValidated.approved_at = approvedAt;
        const result = yield ofValidatedRepository.save(ofValidated);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Erreur lors de la création de OfValidated:', error);
        res.status(500).json({ message: 'Erreur lors de la création de OfValidated', error: error.message });
    }
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidateds = yield ofValidatedRepository.find({ relations: ['project', 'created_by', 'approved_by'] });
        res.json(ofValidateds);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des OfValidateds:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des OfValidateds', error: error.message });
    }
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidated = yield ofValidatedRepository.findOne({
            where: { of_id: Number(req.params.id) },
            relations: ['project', 'created_by', 'approved_by']
        });
        if (!ofValidated)
            return res.status(404).json({ message: 'OfValidated non trouvé' });
        res.json(ofValidated);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de OfValidated:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de OfValidated', error: error.message });
    }
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidated = yield ofValidatedRepository.findOne({
            where: { of_id: Number(req.params.id) },
            relations: ['project', 'created_by', 'approved_by']
        });
        if (!ofValidated)
            return res.status(404).json({ message: 'OfValidated non trouvé' });
        const { projectId, createdBy, approvedBy, approvedAt } = req.body;
        const project = yield (0, typeorm_1.getRepository)(Project_1.default).findOne({ where: { id: projectId } });
        const createdByUser = yield (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs).findOne({ where: { utilisateur_id: createdBy } });
        const approvedByUser = approvedBy ? yield (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs).findOne({ where: { utilisateur_id: approvedBy } }) : null;
        if (!project || !createdByUser) {
            return res.status(400).json({ message: 'Projet ou utilisateur créé par non trouvé' });
        }
        ofValidated.project = project;
        ofValidated.created_by = createdByUser;
        ofValidated.approved_by = approvedByUser || undefined;
        ofValidated.approved_at = approvedAt;
        const result = yield ofValidatedRepository.save(ofValidated);
        res.json(result);
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de OfValidated:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de OfValidated', error: error.message });
    }
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ofValidatedRepository = (0, typeorm_1.getRepository)(OfValidated_1.OfValidated);
    try {
        const ofValidated = yield ofValidatedRepository.findOne({
            where: { of_id: Number(req.params.id) }
        });
        if (!ofValidated)
            return res.status(404).json({ message: 'OfValidated non trouvé' });
        yield ofValidatedRepository.remove(ofValidated);
        res.json({ message: 'OfValidated supprimé' });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de OfValidated:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de OfValidated', error: error.message });
    }
}));
exports.default = router;

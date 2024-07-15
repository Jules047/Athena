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
const Commandes_1 = require("../entity/Commandes");
const router = (0, express_1.Router)();
// Get all Commandes
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commandes = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).find();
        res.json(commandes);
    }
    catch (error) {
        console.error('Error fetching commandes:', error);
        res.status(500).json({ message: 'Error fetching commandes', error: error.message });
    }
}));
// Get a specific Commande by ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commande = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).findOne({ where: { commande_id: Number(req.params.id) } });
        if (commande) {
            res.json(commande);
        }
        else {
            res.status(404).json({ message: 'Commande not found' });
        }
    }
    catch (error) {
        console.error('Error fetching commande:', error);
        res.status(500).json({ message: 'Error fetching commande', error: error.message });
    }
}));
// Create a new Commande
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commande = (0, typeorm_1.getRepository)(Commandes_1.Commandes).create(req.body);
        const result = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).save(commande);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating commande:', error);
        res.status(500).json({ message: 'Error creating commande', error: error.message });
    }
}));
// Update a specific Commande by ID
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commandeRepository = (0, typeorm_1.getRepository)(Commandes_1.Commandes);
        const commande = yield commandeRepository.findOne({ where: { commande_id: Number(req.params.id) } });
        if (commande) {
            commandeRepository.merge(commande, req.body);
            const result = yield commandeRepository.save(commande);
            res.json(result);
        }
        else {
            res.status(404).json({ message: 'Commande not found' });
        }
    }
    catch (error) {
        console.error('Error updating commande:', error);
        res.status(500).json({ message: 'Error updating commande', error: error.message });
    }
}));
// Delete a specific Commande by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).delete(req.params.id);
        if (result.affected) {
            res.json({ message: 'Commande deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Commande not found' });
        }
    }
    catch (error) {
        console.error('Error deleting commande:', error);
        res.status(500).json({ message: 'Error deleting commande', error: error.message });
    }
}));
exports.default = router;

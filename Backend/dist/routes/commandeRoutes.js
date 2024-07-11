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
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commandes = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).find();
    res.json(commandes);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commande = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).findOne({ where: { commande_id: req.params.id } });
    if (commande) {
        res.json(commande);
    }
    else {
        res.status(404).json({ message: 'Commande not found' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commande = (0, typeorm_1.getRepository)(Commandes_1.Commandes).create(req.body);
    const result = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).save(commande);
    res.status(201).json(result);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commande = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).findOne({ where: { commande_id: req.params.id } });
    if (commande) {
        (0, typeorm_1.getRepository)(Commandes_1.Commandes).merge(commande, req.body);
        const result = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).save(commande);
        res.json(result);
    }
    else {
        res.status(404).json({ message: 'Commande not found' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, typeorm_1.getRepository)(Commandes_1.Commandes).delete(req.params.id);
    res.json(result);
}));
exports.default = router;

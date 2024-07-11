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
const Statistiques_1 = require("../entity/Statistiques");
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).find({ relations: ["utilisateur"] });
    res.json(stats);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stat = yield (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).findOne({ where: { stat_id: req.params.id }, relations: ["utilisateur"] });
    if (stat) {
        res.json(stat);
    }
    else {
        res.status(404).json({ message: 'Statistic not found' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stat = (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).create(req.body);
    const result = yield (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).save(stat);
    res.status(201).json(result);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stat = yield (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).findOne({ where: { stat_id: req.params.id } });
    if (stat) {
        (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).merge(stat, req.body);
        const result = yield (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).save(stat);
        res.json(result);
    }
    else {
        res.status(404).json({ message: 'Statistic not found' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, typeorm_1.getRepository)(Statistiques_1.Statistiques).delete(req.params.id);
    res.json(result);
}));
exports.default = router;

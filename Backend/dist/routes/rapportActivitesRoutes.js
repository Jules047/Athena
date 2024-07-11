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
const RapportsActivit_s_1 = require("../entity/RapportsActivit\u00E9s");
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rapports = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).find({ relations: ["utilisateur", "commande"] });
    res.json(rapports);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rapport = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).findOne({ where: { rapport_id: req.params.id }, relations: ["utilisateur", "commande"] });
    if (rapport) {
        res.json(rapport);
    }
    else {
        res.status(404).json({ message: 'Rapport not found' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rapport = (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).create(req.body);
    const result = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).save(rapport);
    res.status(201).json(result);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rapport = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).findOne({ where: { rapport_id: req.params.id } });
    if (rapport) {
        (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).merge(rapport, req.body);
        const result = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).save(rapport);
        res.json(result);
    }
    else {
        res.status(404).json({ message: 'Rapport not found' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).delete(req.params.id);
    res.json(result);
}));
exports.default = router;

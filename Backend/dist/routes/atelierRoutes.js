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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/atelierRoutes.ts
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Atelier_1 = require("../entity/Atelier");
const Collaborateurs_1 = require("../entity/Collaborateurs");
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ateliers = yield (0, typeorm_1.getRepository)(Atelier_1.Atelier).find({ relations: ['collaborateur'] });
        res.json(ateliers);
    }
    catch (error) {
        console.error('Error fetching ateliers:', error);
        res.status(500).json({ message: 'Error fetching ateliers', error: error.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const atelier = yield (0, typeorm_1.getRepository)(Atelier_1.Atelier).findOneOrFail({
            where: { atelier_id: Number(req.params.id) },
            relations: ['collaborateur']
        });
        res.json(atelier);
    }
    catch (error) {
        if (error instanceof Error && error.name === 'EntityNotFound') {
            res.status(404).json({ message: 'Atelier not found' });
        }
        else {
            console.error('Error fetching atelier:', error);
            res.status(500).json({ message: 'Error fetching atelier', error: error.message });
        }
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { collaborateur_id } = _a, atelierData = __rest(_a, ["collaborateur_id"]);
        const atelierRepository = (0, typeorm_1.getRepository)(Atelier_1.Atelier);
        const collaborateur = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).findOne({ where: { collaborateur_id } });
        if (!collaborateur) {
            return res.status(400).json({ message: 'Collaborateur not found' });
        }
        const atelier = atelierRepository.create(Object.assign(Object.assign({}, atelierData), { collaborateur }));
        const result = yield atelierRepository.save(atelier);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating atelier:', error);
        res.status(500).json({ message: 'Error creating atelier', error: error.message });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { collaborateur_id } = _a, atelierData = __rest(_a, ["collaborateur_id"]);
        const atelierRepository = (0, typeorm_1.getRepository)(Atelier_1.Atelier);
        const atelier = yield atelierRepository.findOneOrFail({
            where: { atelier_id: Number(req.params.id) },
            relations: ['collaborateur']
        });
        const collaborateur = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).findOne({ where: { collaborateur_id } });
        if (!collaborateur) {
            return res.status(400).json({ message: 'Collaborateur not found' });
        }
        atelierRepository.merge(atelier, Object.assign(Object.assign({}, atelierData), { collaborateur }));
        const result = yield atelierRepository.save(atelier);
        res.json(result);
    }
    catch (error) {
        console.error('Error updating atelier:', error);
        res.status(500).json({ message: 'Error updating atelier', error: error.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, typeorm_1.getRepository)(Atelier_1.Atelier).delete(req.params.id);
        if (result.affected) {
            res.json({ message: 'Atelier deleted successfully' });
        }
        else {
            res.status(404).json({ message: 'Atelier not found' });
        }
    }
    catch (error) {
        console.error('Error deleting atelier:', error);
        res.status(500).json({ message: 'Error deleting atelier', error: error.message });
    }
}));
exports.default = router;

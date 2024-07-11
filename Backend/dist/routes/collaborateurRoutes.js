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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Collaborateurs_1 = require("../entity/Collaborateurs");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collaborateurs = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).find();
    res.json(collaborateurs);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collaborateur = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).findOne({ where: { collaborateur_id: req.params.id } });
    if (collaborateur) {
        res.json(collaborateur);
    }
    else {
        res.status(404).json({ message: 'Collaborateur not found' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { mot_de_passe } = _a, otherData = __rest(_a, ["mot_de_passe"]);
        const hashedPassword = yield bcryptjs_1.default.hash(mot_de_passe, 10);
        const collaborateur = (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).create(Object.assign(Object.assign({}, otherData), { mot_de_passe: hashedPassword }));
        const result = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).save(collaborateur);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du collaborateur', error });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collaborateur = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).findOne({ where: { collaborateur_id: req.params.id } });
        if (collaborateur) {
            const _a = req.body, { mot_de_passe } = _a, otherData = __rest(_a, ["mot_de_passe"]);
            if (mot_de_passe) {
                const hashedPassword = yield bcryptjs_1.default.hash(mot_de_passe, 10);
                req.body.mot_de_passe = hashedPassword;
            }
            (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).merge(collaborateur, req.body);
            const result = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).save(collaborateur);
            res.json(result);
        }
        else {
            res.status(404).json({ message: 'Collaborateur not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du collaborateur', error });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).delete(req.params.id);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du collaborateur', error });
    }
}));
exports.default = router;

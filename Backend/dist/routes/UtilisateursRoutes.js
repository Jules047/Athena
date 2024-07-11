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
const Utilisateurs_1 = require("../entity/Utilisateurs");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
// Create
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    const { prenom, nom, qualification, droits_acces, mot_de_passe, role } = req.body;
    const user = new Utilisateurs_1.Utilisateurs();
    user.prenom = prenom;
    user.nom = nom;
    user.qualification = qualification;
    user.droits_acces = droits_acces;
    user.mot_de_passe = bcryptjs_1.default.hashSync(mot_de_passe, 10);
    user.role = role;
    yield userRepository.save(user);
    res.json(user);
}));
// Read all
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    const users = yield userRepository.find();
    res.json(users);
}));
// Read one
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    const user = yield userRepository.findOne({ where: { utilisateur_id: parseInt(req.params.id) } });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
}));
// Update
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    const user = yield userRepository.findOne({ where: { utilisateur_id: parseInt(req.params.id) } });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    const { prenom, nom, qualification, droits_acces, mot_de_passe, role } = req.body;
    user.prenom = prenom;
    user.nom = nom;
    user.qualification = qualification;
    user.droits_acces = droits_acces;
    if (mot_de_passe) {
        user.mot_de_passe = bcryptjs_1.default.hashSync(mot_de_passe, 10);
    }
    user.role = role;
    yield userRepository.save(user);
    res.json(user);
}));
// Delete
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    const user = yield userRepository.findOne({ where: { utilisateur_id: parseInt(req.params.id) } });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    yield userRepository.remove(user);
    res.json({ message: 'User deleted' });
}));
exports.default = router;

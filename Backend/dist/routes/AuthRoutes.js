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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Utilisateurs_1 = require("../entity/Utilisateurs");
const router = (0, express_1.Router)();
// Enregistrement
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prenom, nom, qualification, droits_acces, mot_de_passe, role } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    try {
        const existingUser = yield userRepository.findOne({ where: { prenom } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new Utilisateurs_1.Utilisateurs();
        user.prenom = prenom;
        user.nom = nom;
        user.qualification = qualification;
        user.droits_acces = droits_acces;
        user.mot_de_passe = bcryptjs_1.default.hashSync(mot_de_passe, 10);
        user.role = role;
        yield userRepository.save(user);
        res.status(201).json({ message: 'Utilisateur enregistré avec succès!' });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Réinitialisation du mot de passe
router.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prenom } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    try {
        const user = yield userRepository.findOne({ where: { prenom } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const newPassword = Math.random().toString(36).slice(-8);
        user.mot_de_passe = bcryptjs_1.default.hashSync(newPassword, 10);
        yield userRepository.save(user);
        res.json({ newPassword });
    }
    catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Connexion
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prenom, mot_de_passe } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
    try {
        // Vérifiez si les champs prenom et mot_de_passe sont fournis
        if (!prenom || !mot_de_passe) {
            return res.status(400).json({ message: 'Prenom and mot_de_passe are required' });
        }
        const user = yield userRepository.findOne({ where: { prenom } });
        if (!user || !user.mot_de_passe) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Vérifiez si user.mot_de_passe est défini avant de l'utiliser
        const isPasswordValid = bcryptjs_1.default.compareSync(mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.utilisateur_id, prenom: user.prenom, role: user.role }, process.env.JWT_SECRET_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDEsInByZW5vbSI6InNzc3MiLCJyb2xlIjoiQ2xpZW50IiwiaWF0IjoxNzIxMzk4MTczLCJleHAiOjE3MjE0MDE3NzN9.woQ46oKNDRt1q_Y-349fZ5Fbe13YJ7lAS5NaEZ2Yqz8', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;

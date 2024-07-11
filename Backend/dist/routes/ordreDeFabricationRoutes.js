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
const OrdreDeFabrication_1 = require("../entity/OrdreDeFabrication");
const Utilisateurs_1 = require("../entity/Utilisateurs");
const router = (0, express_1.Router)();
// Récupérer tous les ordres de fabrication
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, typeorm_1.getRepository)(OrdreDeFabrication_1.OrdreDeFabrication).find({ relations: ['cree_par', 'mis_a_jour_par'] });
        res.json(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error });
    }
}));
// Récupérer un ordre de fabrication par ID
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield (0, typeorm_1.getRepository)(OrdreDeFabrication_1.OrdreDeFabrication).findOneOrFail({ where: { of_id: Number(req.params.id) }, relations: ['cree_par', 'mis_a_jour_par'] });
        res.json(order);
    }
    catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order', error });
    }
}));
// Créer un nouvel ordre de fabrication
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nom_affaire, description, plans, annotations, plans_fournisseurs, details_poseurs, cree_par } = req.body;
        const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
        const user = yield userRepository.findOneOrFail(cree_par);
        const order = new OrdreDeFabrication_1.OrdreDeFabrication();
        order.nom_affaire = nom_affaire;
        order.description = description;
        order.plans = plans;
        order.annotations = annotations;
        order.plans_fournisseurs = plans_fournisseurs;
        order.details_poseurs = details_poseurs;
        order.cree_par = user;
        yield (0, typeorm_1.getRepository)(OrdreDeFabrication_1.OrdreDeFabrication).save(order);
        res.status(201).json(order);
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error });
    }
}));
// Mettre à jour un ordre de fabrication
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderRepository = (0, typeorm_1.getRepository)(OrdreDeFabrication_1.OrdreDeFabrication);
        const order = yield orderRepository.findOneOrFail({ where: { of_id: Number(req.params.id) } });
        const { cree_par } = req.body;
        if (cree_par) {
            const userRepository = (0, typeorm_1.getRepository)(Utilisateurs_1.Utilisateurs);
            const user = yield userRepository.findOneOrFail(cree_par);
            req.body.cree_par = user;
        }
        orderRepository.merge(order, req.body);
        yield orderRepository.save(order);
        res.json(order);
    }
    catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order', error });
    }
}));
// Supprimer un ordre de fabrication
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, typeorm_1.getRepository)(OrdreDeFabrication_1.OrdreDeFabrication).delete(req.params.id);
        if (result.affected) {
            res.json({ message: 'Ordre de fabrication supprimé avec succès' });
        }
        else {
            res.status(404).json({ message: 'Ordre de fabrication non trouvé' });
        }
    }
    catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order', error });
    }
}));
exports.default = router;

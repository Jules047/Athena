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
const Agenda_1 = require("../entity/Agenda");
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agendas = yield (0, typeorm_1.getRepository)(Agenda_1.Agenda).find({ relations: ["utilisateur"] });
    res.json(agendas);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agenda = yield (0, typeorm_1.getRepository)(Agenda_1.Agenda).findOne({ where: { agenda_id: req.params.id }, relations: ["utilisateur"] });
    if (agenda) {
        res.json(agenda);
    }
    else {
        res.status(404).json({ message: 'Agenda not found' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agenda = (0, typeorm_1.getRepository)(Agenda_1.Agenda).create(req.body);
    const result = yield (0, typeorm_1.getRepository)(Agenda_1.Agenda).save(agenda);
    res.status(201).json(result);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agenda = yield (0, typeorm_1.getRepository)(Agenda_1.Agenda).findOne({ where: { agenda_id: req.params.id } });
    if (agenda) {
        (0, typeorm_1.getRepository)(Agenda_1.Agenda).merge(agenda, req.body);
        const result = yield (0, typeorm_1.getRepository)(Agenda_1.Agenda).save(agenda);
        res.json(result);
    }
    else {
        res.status(404).json({ message: 'Agenda not found' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, typeorm_1.getRepository)(Agenda_1.Agenda).delete(req.params.id);
    res.json(result);
}));
exports.default = router;

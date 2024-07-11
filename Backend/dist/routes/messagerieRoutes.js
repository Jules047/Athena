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
const MessagerieInterne_1 = require("../entity/MessagerieInterne");
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).find({ relations: ["expéditeur", "destinataire"] });
    res.json(messages);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).findOne({ where: { message_id: req.params.id }, relations: ["expéditeur", "destinataire"] });
    if (message) {
        res.json(message);
    }
    else {
        res.status(404).json({ message: 'Message not found' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).create(req.body);
    const result = yield (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).save(message);
    res.status(201).json(result);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).findOne({ where: { message_id: req.params.id } });
    if (message) {
        (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).merge(message, req.body);
        const result = yield (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).save(message);
        res.json(result);
    }
    else {
        res.status(404).json({ message: 'Message not found' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, typeorm_1.getRepository)(MessagerieInterne_1.MessagerieInterne).delete(req.params.id);
    res.json(result);
}));
exports.default = router;

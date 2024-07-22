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
const RapportsActivit_s_1 = require("../entity/RapportsActivit\u00E9s");
const Collaborateurs_1 = require("../entity/Collaborateurs");
const Atelier_1 = require("../entity/Atelier");
const Project_1 = require("../entity/Project");
const Commandes_1 = require("../entity/Commandes");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '..', 'uploads');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Helper function to fetch and validate relations
const fetchAndValidateRelations = (collaborateur_id, atelier_id, project_id, commande_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [collaborateur, atelier, project, commande] = yield Promise.all([
        (0, typeorm_1.getRepository)(Collaborateurs_1.Collaborateurs).findOne({ where: { collaborateur_id } }),
        (0, typeorm_1.getRepository)(Atelier_1.Atelier).findOne({ where: { atelier_id } }),
        (0, typeorm_1.getRepository)(Project_1.Project).findOne({ where: { id: project_id } }),
        (0, typeorm_1.getRepository)(Commandes_1.Commandes).findOne({ where: { commande_id } })
    ]);
    if (!collaborateur || !atelier || !project || !commande) {
        throw new Error('Invalid relations');
    }
    return { collaborateur, atelier, project, commande };
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rapports = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).find({
            relations: ["collaborateur", "atelier", "project", "commande"]
        });
        res.json(rapports);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching rapports", error: error.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rapport = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).findOne({
            where: { rapport_id: +req.params.id },
            relations: ["collaborateur", "atelier", "project", "commande"]
        });
        if (rapport) {
            res.json(rapport);
        }
        else {
            res.status(404).json({ message: 'Rapport not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching rapport", error: error.message });
    }
}));
router.post('/', upload.single('file'), (0, express_validator_1.body)('collaborateur_id').isNumeric(), (0, express_validator_1.body)('atelier_id').isNumeric(), (0, express_validator_1.body)('project_id').isNumeric(), (0, express_validator_1.body)('commande_id').isNumeric(), (0, express_validator_1.body)('date').isISO8601(), (0, express_validator_1.body)('durée').isNumeric(), (0, express_validator_1.body)('coût').isNumeric(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { collaborateur_id, atelier_id, project_id, commande_id, date, durée, coût } = req.body;
        const { collaborateur, atelier, project, commande } = yield fetchAndValidateRelations(+collaborateur_id, +atelier_id, +project_id, +commande_id);
        const rapport = new RapportsActivit_s_1.RapportsActivités();
        rapport.collaborateur = collaborateur;
        rapport.atelier = atelier;
        rapport.project = project;
        rapport.commande = commande;
        rapport.date = date;
        rapport.durée = +durée;
        rapport.coût = +coût;
        if (req.file) {
            rapport.filePath = `/uploads/${req.file.filename}`;
        }
        const result = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).save(rapport);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error in POST /', error); // Log the error
        res.status(400).json({ message: 'Error creating rapport', error: error.message });
    }
}));
router.put('/:id', upload.single('file'), (0, express_validator_1.body)('collaborateur_id').isNumeric(), (0, express_validator_1.body)('atelier_id').isNumeric(), (0, express_validator_1.body)('project_id').isNumeric(), (0, express_validator_1.body)('commande_id').isNumeric(), (0, express_validator_1.body)('date').isISO8601(), (0, express_validator_1.body)('durée').isNumeric(), (0, express_validator_1.body)('coût').isNumeric(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { collaborateur_id, atelier_id, project_id, commande_id, date, durée, coût } = req.body;
        const rapport = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).findOne({
            where: { rapport_id: +req.params.id }
        });
        if (!rapport) {
            return res.status(404).json({ message: 'Rapport not found' });
        }
        const { collaborateur, atelier, project, commande } = yield fetchAndValidateRelations(+collaborateur_id, +atelier_id, +project_id, +commande_id);
        rapport.collaborateur = collaborateur;
        rapport.atelier = atelier;
        rapport.project = project;
        rapport.commande = commande;
        rapport.date = date;
        rapport.durée = +durée;
        rapport.coût = +coût;
        if (req.file) {
            rapport.filePath = `/uploads/${req.file.filename}`;
        }
        const result = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).save(rapport);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating rapport', error: error.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rapport = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).findOne({ where: { rapport_id: +req.params.id } });
        if (!rapport) {
            return res.status(404).json({ message: 'Rapport not found' });
        }
        // Optionally delete the file if it exists
        if (rapport.filePath) {
            const filePath = path_1.default.join(__dirname, '..', 'uploads', path_1.default.basename(rapport.filePath));
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        const result = yield (0, typeorm_1.getRepository)(RapportsActivit_s_1.RapportsActivités).delete(+req.params.id);
        res.json({ message: 'Rapport deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting rapport', error: error.message });
    }
}));
exports.default = router;

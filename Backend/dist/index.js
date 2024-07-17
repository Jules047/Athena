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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const UtilisateursRoutes_1 = __importDefault(require("./routes/UtilisateursRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const statRoutes_1 = __importDefault(require("./routes/statRoutes"));
const commandeRoutes_1 = __importDefault(require("./routes/commandeRoutes"));
const collaborateurRoutes_1 = __importDefault(require("./routes/collaborateurRoutes"));
const atelierRoutes_1 = __importDefault(require("./routes/atelierRoutes"));
const rapportActivitesRoutes_1 = __importDefault(require("./routes/rapportActivitesRoutes"));
const messagerieRoutes_1 = __importDefault(require("./routes/messagerieRoutes"));
const agendaRoutes_1 = __importDefault(require("./routes/agendaRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const ordreDeFabricationRoutes_1 = __importDefault(require("./routes/ordreDeFabricationRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const ofValidatedRoutes_1 = __importDefault(require("./routes/ofValidatedRoutes"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config(); // Charge les variables d'environnement à partir du fichier .env
(0, typeorm_1.createConnection)().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use('/auth', authRoutes_1.default);
    app.use('/utilisateurs', authMiddleware_1.default, UtilisateursRoutes_1.default);
    app.use('/administrateurs', authMiddleware_1.default, adminRoutes_1.default);
    app.use('/statistiques', authMiddleware_1.default, statRoutes_1.default);
    app.use('/commandes', authMiddleware_1.default, commandeRoutes_1.default);
    app.use('/collaborateurs', authMiddleware_1.default, collaborateurRoutes_1.default);
    app.use('/ateliers', authMiddleware_1.default, atelierRoutes_1.default);
    app.use('/rapport', authMiddleware_1.default, rapportActivitesRoutes_1.default);
    app.use('/messagerieInterne', authMiddleware_1.default, messagerieRoutes_1.default);
    app.use('/agenda', authMiddleware_1.default, agendaRoutes_1.default);
    app.use('/ordres-de-fabrication', ordreDeFabricationRoutes_1.default);
    app.use('/projects', projectRoutes_1.default);
    app.use('/of_validated', ofValidatedRoutes_1.default);
    // Serve static files from the "uploads" directory
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
    // Route to download uploaded file
    app.get('/download/:filename', (req, res) => {
        const filename = req.params.filename;
        const filePath = path_1.default.join(__dirname, 'uploads', filename);
        console.log(`Request to download file at ${filePath}`);
        if (fs_1.default.existsSync(filePath)) {
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.sendFile(filePath);
        }
        else {
            console.error(`File not found at ${filePath}`);
            res.status(404).send('File not found');
        }
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})).catch(error => console.log(error));

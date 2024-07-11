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
const UtilisateursRoutes_1 = __importDefault(require("./routes/UtilisateursRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const statRoutes_1 = __importDefault(require("./routes/statRoutes"));
const commandeRoutes_1 = __importDefault(require("./routes/commandeRoutes"));
const collaborateurRoutes_1 = __importDefault(require("./routes/collaborateurRoutes"));
const atelierRoutes_1 = __importDefault(require("./routes/atelierRoutes"));
const rapportActivitesRoutes_1 = __importDefault(require("./routes/rapportActivitesRoutes"));
const messagerieRoutes_1 = __importDefault(require("./routes/messagerieRoutes"));
const agendaRoutes_1 = __importDefault(require("./routes/agendaRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Importer les routes d'authentification
(0, typeorm_1.createConnection)().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use('/Utilisateurs', UtilisateursRoutes_1.default);
    app.use('/Administrateurs', adminRoutes_1.default);
    app.use('/statistiques', statRoutes_1.default);
    app.use('/Commandes', commandeRoutes_1.default);
    app.use('/collaborateurs', collaborateurRoutes_1.default);
    app.use('/ateliers', atelierRoutes_1.default);
    app.use('/Rapport', rapportActivitesRoutes_1.default);
    app.use('/MessagerieInterne', messagerieRoutes_1.default);
    app.use('/Agenda', agendaRoutes_1.default);
    app.use('/auth', authRoutes_1.default); // Ajouter les routes d'authentification
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
})).catch(error => console.log(error));

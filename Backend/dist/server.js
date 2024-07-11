"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv")); // Import dotenv
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const collaborateurRoutes_1 = __importDefault(require("./routes/collaborateurRoutes"));
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
const Collaborateurs_1 = require("./entity/Collaborateurs");
const Utilisateurs_1 = require("./entity/Utilisateurs");
// Charger les variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Initialize Data Source
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1234',
    database: 'athena',
    synchronize: true,
    logging: false,
    entities: [Collaborateurs_1.Collaborateurs, Utilisateurs_1.Utilisateurs],
    migrations: ['src/migration/*.ts'],
    subscribers: [],
});
dataSource.initialize().then(() => {
    console.log('Data Source has been initialized!');
    // Middleware
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    // Routes
    app.use('/auth', authRoutes_1.default);
    app.use('/api/collaborateurs', authMiddleware_1.default, collaborateurRoutes_1.default); // Protect this route with the auth middleware
    // Start the server
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Error during Data Source initialization:', err);
});

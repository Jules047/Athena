"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const Project_1 = require("./entity/Project");
const Utilisateurs_1 = require("./entity/Utilisateurs");
const OfValidated_1 = require("./entity/OfValidated");
const Document_1 = require("./entity/Document");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "athena",
    synchronize: true,
    logging: true,
    entities: [Project_1.Project, Utilisateurs_1.Utilisateurs, OfValidated_1.OfValidated, Document_1.Document],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});

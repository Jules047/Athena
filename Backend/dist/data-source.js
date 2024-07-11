"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const path_1 = __importDefault(require("path"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1234",
    database: "athena",
    synchronize: false, // Ensure this is false in production to avoid unintended schema changes
    logging: false,
    entities: [path_1.default.join(__dirname, '/entities/*.ts')],
    migrations: [path_1.default.join(__dirname, '/migration/*.ts')],
    subscribers: [path_1.default.join(__dirname, '/subscriber/**/*.ts')],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});

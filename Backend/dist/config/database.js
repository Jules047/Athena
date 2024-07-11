"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Utilisateurs_1 = require("../entity/Utilisateurs");
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: 'athena',
    dialect: 'postgres',
    username: 'postgres',
    password: '1234',
    storage: ':memory:',
    models: [Utilisateurs_1.Utilisateurs],
});

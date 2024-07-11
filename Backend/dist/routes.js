"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthRoutes_1 = require("./routes/AuthRoutes");
const routes = (0, express_1.Router)();
routes.post("/register", AuthRoutes_1.AuthController.register);
routes.post("/login", AuthRoutes_1.AuthController.login);
exports.default = routes;

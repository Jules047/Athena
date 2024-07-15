"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfValidated = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const Utilisateurs_1 = require("./Utilisateurs");
const Document_1 = require("./Document");
let OfValidated = class OfValidated {
};
exports.OfValidated = OfValidated;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OfValidated.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, project => project.ofValidated),
    __metadata("design:type", Project_1.Project)
], OfValidated.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], OfValidated.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], OfValidated.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], OfValidated.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Document_1.Document, document => document.ofValidated),
    __metadata("design:type", Array)
], OfValidated.prototype, "documents", void 0);
exports.OfValidated = OfValidated = __decorate([
    (0, typeorm_1.Entity)()
], OfValidated);
exports.default = OfValidated;
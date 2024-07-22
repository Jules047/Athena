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
exports.Atelier = void 0;
// src/entity/Atelier.ts
const typeorm_1 = require("typeorm");
const Collaborateurs_1 = require("./Collaborateurs");
let Atelier = class Atelier {
};
exports.Atelier = Atelier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Atelier.prototype, "atelier_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Atelier.prototype, "type_tache", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Atelier.prototype, "taux_horaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Atelier.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Atelier.prototype, "cout", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Atelier.prototype, "heures_travail", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Collaborateurs_1.Collaborateurs, (collaborateur) => collaborateur.ateliers, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Collaborateurs_1.Collaborateurs)
], Atelier.prototype, "collaborateur", void 0);
exports.Atelier = Atelier = __decorate([
    (0, typeorm_1.Entity)({ name: 'atelier' })
], Atelier);

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
exports.Statistiques = void 0;
const typeorm_1 = require("typeorm");
const Utilisateurs_1 = require("./Utilisateurs");
let Statistiques = class Statistiques {
};
exports.Statistiques = Statistiques;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Statistiques.prototype, "stat_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs, utilisateur => utilisateur.utilisateur_id),
    (0, typeorm_1.JoinColumn)({ name: "utilisateur_id" }),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], Statistiques.prototype, "utilisateur", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Statistiques.prototype, "type_activit\u00E9", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], Statistiques.prototype, "date_activit\u00E9", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "interval" }),
    __metadata("design:type", Object)
], Statistiques.prototype, "dur\u00E9e_activit\u00E9", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Statistiques.prototype, "co\u00FBt", void 0);
exports.Statistiques = Statistiques = __decorate([
    (0, typeorm_1.Entity)({ name: "statistiques" }) // Assurez-vous que le nom de la table correspond à celui de votre base de données
], Statistiques);

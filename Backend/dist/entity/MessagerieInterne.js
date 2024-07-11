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
exports.MessagerieInterne = void 0;
const typeorm_1 = require("typeorm");
const Utilisateurs_1 = require("./Utilisateurs");
let MessagerieInterne = class MessagerieInterne {
};
exports.MessagerieInterne = MessagerieInterne;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MessagerieInterne.prototype, "message_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs, utilisateur => utilisateur.utilisateur_id),
    (0, typeorm_1.JoinColumn)({ name: "expéditeur_id" }),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], MessagerieInterne.prototype, "exp\u00E9diteur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs, utilisateur => utilisateur.utilisateur_id),
    (0, typeorm_1.JoinColumn)({ name: "destinataire_id" }),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], MessagerieInterne.prototype, "destinataire", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], MessagerieInterne.prototype, "objet", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], MessagerieInterne.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], MessagerieInterne.prototype, "date_envoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time" }),
    __metadata("design:type", String)
], MessagerieInterne.prototype, "heure_envoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], MessagerieInterne.prototype, "pi\u00E8ces_jointes", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], MessagerieInterne.prototype, "statut", void 0);
exports.MessagerieInterne = MessagerieInterne = __decorate([
    (0, typeorm_1.Entity)({ name: "messagerie_interne" }) // Assurez-vous que le nom de la table correspond à celui de votre base de données
], MessagerieInterne);

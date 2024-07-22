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
exports.RapportsActivités = void 0;
const typeorm_1 = require("typeorm");
const Collaborateurs_1 = require("./Collaborateurs");
const Atelier_1 = require("./Atelier");
const Project_1 = require("./Project");
const Commandes_1 = require("./Commandes");
let RapportsActivités = class RapportsActivités {
};
exports.RapportsActivités = RapportsActivités;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RapportsActivités.prototype, "rapport_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Collaborateurs_1.Collaborateurs, collaborateur => collaborateur.collaborateur_id),
    (0, typeorm_1.JoinColumn)({ name: "collaborateur_id" }),
    __metadata("design:type", Collaborateurs_1.Collaborateurs)
], RapportsActivités.prototype, "collaborateur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Atelier_1.Atelier, atelier => atelier.atelier_id),
    (0, typeorm_1.JoinColumn)({ name: "atelier_id" }),
    __metadata("design:type", Atelier_1.Atelier)
], RapportsActivités.prototype, "atelier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, project => project.id),
    (0, typeorm_1.JoinColumn)({ name: "project_id" }),
    __metadata("design:type", Project_1.Project)
], RapportsActivités.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Commandes_1.Commandes, commande => commande.commande_id),
    (0, typeorm_1.JoinColumn)({ name: "commande_id" }),
    __metadata("design:type", Commandes_1.Commandes)
], RapportsActivités.prototype, "commande", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], RapportsActivités.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int" }),
    __metadata("design:type", Number)
], RapportsActivités.prototype, "dur\u00E9e", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], RapportsActivités.prototype, "co\u00FBt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RapportsActivités.prototype, "filePath", void 0);
exports.RapportsActivités = RapportsActivités = __decorate([
    (0, typeorm_1.Entity)({ name: "rapports_activités" })
], RapportsActivités);

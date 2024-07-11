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
exports.OrdreDeFabrication = void 0;
const typeorm_1 = require("typeorm");
const Utilisateurs_1 = require("./Utilisateurs");
let OrdreDeFabrication = class OrdreDeFabrication {
};
exports.OrdreDeFabrication = OrdreDeFabrication;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrdreDeFabrication.prototype, "of_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], OrdreDeFabrication.prototype, "nom_affaire", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], OrdreDeFabrication.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrdreDeFabrication.prototype, "date_creation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs),
    (0, typeorm_1.JoinColumn)({ name: 'cree_par' }),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], OrdreDeFabrication.prototype, "cree_par", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], OrdreDeFabrication.prototype, "plans", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], OrdreDeFabrication.prototype, "annotations", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], OrdreDeFabrication.prototype, "plans_fournisseurs", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], OrdreDeFabrication.prototype, "details_poseurs", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], OrdreDeFabrication.prototype, "derniere_mise_a_jour", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs),
    (0, typeorm_1.JoinColumn)({ name: 'mis_a_jour_par' }),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], OrdreDeFabrication.prototype, "mis_a_jour_par", void 0);
exports.OrdreDeFabrication = OrdreDeFabrication = __decorate([
    (0, typeorm_1.Entity)({ name: 'ordres_de_fabrication' })
], OrdreDeFabrication);

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
exports.Collaborateurs = void 0;
const typeorm_1 = require("typeorm");
const Atelier_1 = require("./Atelier");
let Collaborateurs = class Collaborateurs {
};
exports.Collaborateurs = Collaborateurs;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Collaborateurs.prototype, "collaborateur_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Collaborateurs.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Collaborateurs.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Collaborateurs.prototype, "qualification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Collaborateurs.prototype, "droits_acces", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, default: 'defaultpassword' }),
    __metadata("design:type", String)
], Collaborateurs.prototype, "mot_de_passe", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Collaborateurs.prototype, "cree_le", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Collaborateurs.prototype, "modifie_le", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Atelier_1.Atelier, (atelier) => atelier.collaborateur),
    __metadata("design:type", Array)
], Collaborateurs.prototype, "ateliers", void 0);
exports.Collaborateurs = Collaborateurs = __decorate([
    (0, typeorm_1.Entity)({ name: "collaborateurs" })
], Collaborateurs);

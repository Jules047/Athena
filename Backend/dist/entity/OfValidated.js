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
let OfValidated = class OfValidated {
};
exports.OfValidated = OfValidated;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OfValidated.prototype, "of_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project),
    (0, typeorm_1.JoinColumn)({ name: 'project_id' }),
    __metadata("design:type", Project_1.Project)
], OfValidated.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], OfValidated.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Utilisateurs_1.Utilisateurs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", Utilisateurs_1.Utilisateurs)
], OfValidated.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], OfValidated.prototype, "approved_at", void 0);
exports.OfValidated = OfValidated = __decorate([
    (0, typeorm_1.Entity)()
], OfValidated);
exports.default = OfValidated;

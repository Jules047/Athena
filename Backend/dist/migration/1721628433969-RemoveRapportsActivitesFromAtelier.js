"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveRapportsActivitesFromAtelier = void 0;
const typeorm_1 = require("typeorm");
class RemoveRapportsActivitesFromAtelier {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Supprimer la clé étrangère si elle existe
            const table = yield queryRunner.getTable('atelier');
            const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf('collaborateur_id') !== -1);
            if (foreignKey) {
                yield queryRunner.dropForeignKey('atelier', foreignKey);
            }
            // Supprimer la colonne collaborateur_id si elle existe
            yield queryRunner.dropColumn('atelier', 'collaborateur_id');
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ajouter la colonne collaborateur_id
            yield queryRunner.addColumn('atelier', new typeorm_1.TableColumn({
                name: 'collaborateur_id',
                type: 'int',
                isNullable: true,
            }));
            // Ajouter la clé étrangère pour collaborateur_id
            yield queryRunner.createForeignKey('atelier', new typeorm_1.TableForeignKey({
                columnNames: ['collaborateur_id'],
                referencedTableName: 'collaborateurs',
                referencedColumnNames: ['collaborateur_id'],
                onDelete: 'SET NULL', // Modifier selon le comportement souhaité
            }));
        });
    }
}
exports.RemoveRapportsActivitesFromAtelier = RemoveRapportsActivitesFromAtelier;

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import User from '#models/user';
import Empresa from '#models/empresa';
export default class Pqrs extends BaseModel {
    static table = 'pqrs';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_pqrs' }),
    __metadata("design:type", Number)
], Pqrs.prototype, "idPQRS", void 0);
__decorate([
    column({ columnName: 'usuario_id' }),
    __metadata("design:type", Number)
], Pqrs.prototype, "usuarioId", void 0);
__decorate([
    column({ columnName: 'empresa_id' }),
    __metadata("design:type", Number)
], Pqrs.prototype, "empresaId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Pqrs.prototype, "asunto", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Pqrs.prototype, "mensaje", void 0);
__decorate([
    column.dateTime({ columnName: 'fecha_creacion' }),
    __metadata("design:type", Object)
], Pqrs.prototype, "fechaCreacion", void 0);
__decorate([
    belongsTo(() => User, { foreignKey: 'usuarioId' }),
    __metadata("design:type", Object)
], Pqrs.prototype, "usuario", void 0);
__decorate([
    belongsTo(() => Empresa, { foreignKey: 'empresaId' }),
    __metadata("design:type", Object)
], Pqrs.prototype, "empresa", void 0);
//# sourceMappingURL=pqrs.js.map
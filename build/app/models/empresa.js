var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import User from '#models/user';
import Bus from '#models/bus';
import Ruta from '#models/ruta';
import Pqrs from '#models/pqrs';
export default class Empresa extends BaseModel {
    static table = 'empresas';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_empresa' }),
    __metadata("design:type", Number)
], Empresa.prototype, "idEmpresa", void 0);
__decorate([
    column({ columnName: 'nombre_empresa' }),
    __metadata("design:type", String)
], Empresa.prototype, "nombreEmpresa", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Empresa.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Empresa.prototype, "direccion", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Empresa.prototype, "telefono", void 0);
__decorate([
    hasMany(() => Pqrs, {
        foreignKey: 'empresaId'
    }),
    __metadata("design:type", Object)
], Empresa.prototype, "pqrs", void 0);
__decorate([
    hasMany(() => User, {
        foreignKey: 'empresaId'
    }),
    __metadata("design:type", Object)
], Empresa.prototype, "usuarios", void 0);
__decorate([
    hasMany(() => Bus, {
        foreignKey: 'empresaId'
    }),
    __metadata("design:type", Object)
], Empresa.prototype, "buses", void 0);
__decorate([
    hasMany(() => Ruta, {
        foreignKey: 'empresaId'
    }),
    __metadata("design:type", Object)
], Empresa.prototype, "rutas", void 0);
//# sourceMappingURL=empresa.js.map
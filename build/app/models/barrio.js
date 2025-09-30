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
import Paradero from '#models/paradero';
export default class Barrio extends BaseModel {
    static table = 'barrios';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_barrio' }),
    __metadata("design:type", Number)
], Barrio.prototype, "idBarrio", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Barrio.prototype, "nombre", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Barrio.prototype, "latitud", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Barrio.prototype, "longitud", void 0);
__decorate([
    hasMany(() => Paradero, {
        foreignKey: 'barrio_id'
    }),
    __metadata("design:type", Object)
], Barrio.prototype, "paraderos", void 0);
//# sourceMappingURL=barrio.js.map
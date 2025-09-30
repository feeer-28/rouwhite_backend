var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm';
import Empresa from '#models/empresa';
import Favorito from '#models/favorito';
import Paradero from '#models/paradero';
import RutaParadero from '#models/rutas_paradero';
export default class Ruta extends BaseModel {
    static table = 'rutas';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_ruta' }),
    __metadata("design:type", Number)
], Ruta.prototype, "idRuta", void 0);
__decorate([
    column({ columnName: 'nombre_ruta' }),
    __metadata("design:type", String)
], Ruta.prototype, "nombreRuta", void 0);
__decorate([
    column({ columnName: 'empresa_id' }),
    __metadata("design:type", Number)
], Ruta.prototype, "empresaId", void 0);
__decorate([
    belongsTo(() => Empresa, {
        foreignKey: 'empresaId'
    }),
    __metadata("design:type", Object)
], Ruta.prototype, "empresa", void 0);
__decorate([
    hasMany(() => Favorito, {
        foreignKey: 'rutaId'
    }),
    __metadata("design:type", Object)
], Ruta.prototype, "favoritos", void 0);
__decorate([
    hasMany(() => RutaParadero, {
        foreignKey: 'rutaId'
    }),
    __metadata("design:type", Object)
], Ruta.prototype, "rutaParaderos", void 0);
__decorate([
    manyToMany(() => Paradero, {
        pivotTable: 'ruta_paraderos',
        localKey: 'idRuta',
        pivotForeignKey: 'ruta_id',
        relatedKey: 'idParadero',
        pivotRelatedForeignKey: 'paradero_id'
    }),
    __metadata("design:type", Object)
], Ruta.prototype, "paraderos", void 0);
//# sourceMappingURL=ruta.js.map
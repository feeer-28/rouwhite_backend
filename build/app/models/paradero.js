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
import Barrio from '#models/barrio';
import RutaParadero from '#models/rutas_paradero';
import Ruta from '#models/ruta';
export default class Paradero extends BaseModel {
    static table = 'paraderos';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_paradero' }),
    __metadata("design:type", Number)
], Paradero.prototype, "idParadero", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Paradero.prototype, "nombre", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paradero.prototype, "direccion", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paradero.prototype, "latitud", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paradero.prototype, "longitud", void 0);
__decorate([
    column({ columnName: 'barrio_id' }),
    __metadata("design:type", Object)
], Paradero.prototype, "barrioId", void 0);
__decorate([
    belongsTo(() => Barrio, {
        foreignKey: 'barrioId'
    }),
    __metadata("design:type", Object)
], Paradero.prototype, "barrio", void 0);
__decorate([
    hasMany(() => RutaParadero, {
        foreignKey: 'paraderoId'
    }),
    __metadata("design:type", Object)
], Paradero.prototype, "rutaParaderos", void 0);
__decorate([
    manyToMany(() => Ruta, {
        pivotTable: 'ruta_paraderos',
        localKey: 'idParadero',
        pivotForeignKey: 'paradero_id',
        relatedKey: 'idRuta',
        pivotRelatedForeignKey: 'ruta_id'
    }),
    __metadata("design:type", Object)
], Paradero.prototype, "rutas", void 0);
//# sourceMappingURL=paradero.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Empresa from '#models/empresa';
export default class Bus extends BaseModel {
    static table = 'buses';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_bus' }),
    __metadata("design:type", Number)
], Bus.prototype, "idBus", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Bus.prototype, "placa", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Bus.prototype, "descripcion", void 0);
__decorate([
    column({ columnName: 'empresa_id' }),
    __metadata("design:type", Number)
], Bus.prototype, "empresaId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Bus.prototype, "latitud", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Bus.prototype, "longitud", void 0);
__decorate([
    column.dateTime({ columnName: 'ultima_actualizacion' }),
    __metadata("design:type", DateTime)
], Bus.prototype, "ultimaActualizacion", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Bus.prototype, "estado", void 0);
__decorate([
    belongsTo(() => Empresa, {
        foreignKey: 'empresaId'
    }),
    __metadata("design:type", Object)
], Bus.prototype, "empresa", void 0);
//# sourceMappingURL=bus.js.map
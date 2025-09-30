var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Ruta from '#models/ruta';
import Paradero from '#models/paradero';
export var TipoRuta;
(function (TipoRuta) {
    TipoRuta["IDA"] = "ida";
    TipoRuta["RETORNO"] = "retorno";
})(TipoRuta || (TipoRuta = {}));
export default class RutaParadero extends BaseModel {
    static table = 'ruta_paraderos';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_ruta_paradero' }),
    __metadata("design:type", Number)
], RutaParadero.prototype, "idRutaParadero", void 0);
__decorate([
    column({ columnName: 'ruta_id' }),
    __metadata("design:type", Number)
], RutaParadero.prototype, "rutaId", void 0);
__decorate([
    column({ columnName: 'paradero_id' }),
    __metadata("design:type", Number)
], RutaParadero.prototype, "paraderoId", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], RutaParadero.prototype, "orden", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], RutaParadero.prototype, "tipo", void 0);
__decorate([
    belongsTo(() => Ruta, { foreignKey: 'ruta_id' }),
    __metadata("design:type", Object)
], RutaParadero.prototype, "ruta", void 0);
__decorate([
    belongsTo(() => Paradero, { foreignKey: 'paradero_id' }),
    __metadata("design:type", Object)
], RutaParadero.prototype, "paradero", void 0);
//# sourceMappingURL=rutas_paradero.js.map
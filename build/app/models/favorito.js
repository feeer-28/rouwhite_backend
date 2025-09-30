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
import User from '#models/user';
import Ruta from '#models/ruta';
export default class Favorito extends BaseModel {
    static table = 'favoritos';
}
__decorate([
    column({ isPrimary: true, columnName: 'id_favorito' }),
    __metadata("design:type", Number)
], Favorito.prototype, "idFavorito", void 0);
__decorate([
    column({ columnName: 'usuario_id' }),
    __metadata("design:type", Number)
], Favorito.prototype, "usuarioId", void 0);
__decorate([
    column({ columnName: 'ruta_id' }),
    __metadata("design:type", Number)
], Favorito.prototype, "rutaId", void 0);
__decorate([
    belongsTo(() => User, {
        foreignKey: 'usuarioId',
    }),
    __metadata("design:type", Object)
], Favorito.prototype, "usuario", void 0);
__decorate([
    belongsTo(() => Ruta, {
        foreignKey: 'rutaId',
    }),
    __metadata("design:type", Object)
], Favorito.prototype, "ruta", void 0);
//# sourceMappingURL=favorito.js.map
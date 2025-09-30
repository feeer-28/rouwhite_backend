var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import Role from '#models/role';
import Empresa from '#models/empresa';
import Favorito from '#models/favorito';
import Pqrs from '#models/pqrs';
const AuthFinder = withAuthFinder(() => hash.use('bcrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
});
export default class User extends compose(BaseModel, AuthFinder) {
    static table = 'usuarios';
    static accessTokens = DbAccessTokensProvider.forModel(User);
}
__decorate([
    column({ isPrimary: true, columnName: 'id_usuario' }),
    __metadata("design:type", Number)
], User.prototype, "idUsuario", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "nombre", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "apellido", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "identificacion", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "estado", void 0);
__decorate([
    column({ columnName: 'rol_id' }),
    __metadata("design:type", Number)
], User.prototype, "rolId", void 0);
__decorate([
    column({ columnName: 'empresa_id' }),
    __metadata("design:type", Object)
], User.prototype, "empresaId", void 0);
__decorate([
    belongsTo(() => Role, {
        foreignKey: 'rolId'
    }),
    __metadata("design:type", Object)
], User.prototype, "rol", void 0);
__decorate([
    hasMany(() => Pqrs, {
        foreignKey: 'usuarioId'
    }),
    __metadata("design:type", Object)
], User.prototype, "pqrs", void 0);
__decorate([
    belongsTo(() => Empresa, {
        foreignKey: 'empresaId'
    }),
    __metadata("design:type", Object)
], User.prototype, "empresa", void 0);
__decorate([
    hasMany(() => Favorito, {
        foreignKey: 'usuarioId'
    }),
    __metadata("design:type", Object)
], User.prototype, "favoritos", void 0);
//# sourceMappingURL=user.js.map
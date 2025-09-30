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
export var RolTipo;
(function (RolTipo) {
    RolTipo["ADMIN"] = "admin";
    RolTipo["DESPACHADOR"] = "despachador";
    RolTipo["CONDUCTOR"] = "conductor";
    RolTipo["USUARIO"] = "usuario";
})(RolTipo || (RolTipo = {}));
export default class Role extends BaseModel {
    static table = 'roles';
}
__decorate([
    column({ isPrimary: true, columnName: 'idrol' }),
    __metadata("design:type", Number)
], Role.prototype, "idRol", void 0);
__decorate([
    column({ columnName: 'nombrerol' }),
    __metadata("design:type", String)
], Role.prototype, "nombreRol", void 0);
__decorate([
    hasMany(() => User, {
        foreignKey: 'rolId'
    }),
    __metadata("design:type", Object)
], Role.prototype, "usuarios", void 0);
//# sourceMappingURL=role.js.map
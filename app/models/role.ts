import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

// Enum para el tipo de rol
export enum RolTipo {
  ADMIN = 'admin',
  DESPACHADOR = 'despachador',
  CONDUCTOR = 'conductor',
  USUARIO = 'usuario'
}

export default class Role extends BaseModel {
  static table = 'roles'

  @column({ isPrimary: true, columnName: 'id_rol' })
  declare idRol: number

  @column({ columnName: 'nombre_rol' })
  declare nombreRol: RolTipo

  // Relaciones
  @hasMany(() => User, {
    foreignKey: 'rolId'
  })
  declare usuarios: HasMany<typeof User>
}
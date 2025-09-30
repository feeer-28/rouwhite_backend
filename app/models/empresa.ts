import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Bus from '#models/bus'
import Ruta from '#models/ruta'
import Pqrs from '#models/pqrs'

export default class Empresa extends BaseModel {
  static table = 'empresas'

  @column({ isPrimary: true, columnName: 'id_empresa' })
  declare idEmpresa: number

  @column({ columnName: 'nombre_empresa' })
  declare nombreEmpresa: string

  @column()
  declare email: string | null

  @column()
  declare direccion: string | null

  @column()
  declare telefono: string | null

  // Relaciones
  @hasMany(() => Pqrs, {
    foreignKey: 'empresaId'
  })
  declare pqrs: HasMany<typeof Pqrs>

  // Relaciones
  @hasMany(() => User, {
    foreignKey: 'empresaId'
  })
  declare usuarios: HasMany<typeof User>

  @hasMany(() => Bus, {
    foreignKey: 'empresaId'
  })
  declare buses: HasMany<typeof Bus>

  @hasMany(() => Ruta, {
    foreignKey: 'empresaId'
  })
  declare rutas: HasMany<typeof Ruta>
}
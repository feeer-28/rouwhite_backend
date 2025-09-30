import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Paradero from '#models/paradero'

export default class Barrio extends BaseModel {
  static table = 'barrios'

  @column({ isPrimary: true, columnName: 'id_barrio' })
  declare idBarrio: number

  @column()
  declare nombre: string

  @column()
  declare latitud: number | null

  @column()
  declare longitud: number | null

  // Relaciones
  @hasMany(() => Paradero, {
    foreignKey: 'barrio_id'
  })
  declare paraderos: HasMany<typeof Paradero>
}
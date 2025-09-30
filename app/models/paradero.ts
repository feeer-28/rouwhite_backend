import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Barrio from '#models/barrio'
import RutaParadero from '#models/rutas_paradero'
import Ruta from '#models/ruta'

export default class Paradero extends BaseModel {
  static table = 'paraderos'

  @column({ isPrimary: true, columnName: 'id_paradero' })
  declare idParadero: number

  @column()
  declare nombre: string

  @column()
  declare direccion: string | null

  @column()
  declare latitud: number | null

  @column()
  declare longitud: number | null

  @column({ columnName: 'barrio_id' })
  declare barrioId: number | null

  // Relaciones
  @belongsTo(() => Barrio, {
    foreignKey: 'barrioId'
  })
  declare barrio: BelongsTo<typeof Barrio>

  @hasMany(() => RutaParadero, {
    foreignKey: 'paraderoId'
  })
  declare rutaParaderos: HasMany<typeof RutaParadero>

  @manyToMany(() => Ruta, {
    pivotTable: 'ruta_paraderos',
    localKey: 'idParadero',
    pivotForeignKey: 'paradero_id',
    relatedKey: 'idRuta',
    pivotRelatedForeignKey: 'ruta_id'
  })
  declare rutas: ManyToMany<typeof Ruta>
}
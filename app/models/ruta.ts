import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Empresa from '#models/empresa'
import Favorito from '#models/favorito'
import Paradero from '#models/paradero'
import RutaParadero from '#models/rutas_paradero'

export default class Ruta extends BaseModel {
  static table = 'rutas'

  @column({ isPrimary: true, columnName: 'id_ruta' })
  declare idRuta: number

  @column({ columnName: 'nombre_ruta' })
  declare nombreRuta: string

  @column({ columnName: 'empresa_id' })
  declare empresaId: number

  // Relaciones
  @belongsTo(() => Empresa, {
    foreignKey: 'empresaId'
  })
  declare empresa: BelongsTo<typeof Empresa>

  @hasMany(() => Favorito, {
    foreignKey: 'rutaId'
  })
  declare favoritos: HasMany<typeof Favorito>

  @hasMany(() => RutaParadero, {
    foreignKey: 'rutaId'
  })
  declare rutaParaderos: HasMany<typeof RutaParadero>

  @manyToMany(() => Paradero, {
    pivotTable: 'ruta_paraderos',
    localKey: 'idRuta',
    pivotForeignKey: 'ruta_id',
    relatedKey: 'idParadero',
    pivotRelatedForeignKey: 'paradero_id'
  })
  declare paraderos: ManyToMany<typeof Paradero>
}
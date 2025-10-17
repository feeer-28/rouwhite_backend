import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Empresa from '#models/empresa'
import Ruta from '#models/ruta'

export default class Bus extends BaseModel {
  static table = 'buses'

  @column({ isPrimary: true, columnName: 'id_bus' })
  declare idBus: number

  @column()
  declare placa: string

  @column()
  declare descripcion: string | null

  @column({ columnName: 'empresa_id' })
  declare empresaId: number

  @column({ columnName: 'ruta_id' })
  declare rutaId: number

  @column()
  declare latitud: number | null

  @column()
  declare longitud: number | null

  @column.dateTime({ columnName: 'ultima_actualizacion' })
  declare ultimaActualizacion: DateTime

  @column()
  declare estado: boolean

  // Relaciones
  @belongsTo(() => Empresa, {
    foreignKey: 'empresaId'
  })
  declare empresa: BelongsTo<typeof Empresa>

  @belongsTo(() => Ruta, {
    foreignKey: 'rutaId'
  })
  declare ruta: BelongsTo<typeof Ruta>
}
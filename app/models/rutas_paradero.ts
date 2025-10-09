
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Ruta from '#models/ruta'
import Paradero from '#models/paradero'

export enum TipoRuta {
  IDA = 'ida',
  RETORNO = 'retorno',
}

export default class RutaParadero extends BaseModel {
  static table = 'ruta_paraderos'

  @column({ isPrimary: true, columnName: 'id_ruta_paradero' })
  declare idRutaParadero: number

  @column({ columnName: 'ruta_id' })
  declare rutaId: number

  @column({ columnName: 'paradero_id' })
  declare paraderoId: number

  @column()
  declare orden: number

  @column()
  declare tipo: TipoRuta

  // Relaciones
  @belongsTo(() => Ruta, { foreignKey: 'rutaId' })
  declare ruta: BelongsTo<typeof Ruta>

  @belongsTo(() => Paradero, { foreignKey: 'paraderoId' })
  declare paradero: BelongsTo<typeof Paradero>
}